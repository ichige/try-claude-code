import type { HttpRequest } from '@azure/functions'
import type { ZodType } from 'zod'
import { ValidationError } from '../../errors'
import type { NextFunction } from '../../shared'
import type { Passable } from '../../lib/passable'

/** Zod スキーマ、または HttpRequest からスキーマを生成するファクトリ関数 */
export type SchemaOrFactory<T> = ZodType<T> | ((req: HttpRequest) => ZodType<T>)

/**
 * path パラメータを Zod スキーマで検証するミドルウェアを生成する。
 * 検証成功時は parsed result を passable.params にマージして next へ渡す。
 * 検証失敗時は ValidationError をスローし、postInvocation フックが 400 に変換する。
 * @param schema - 検証に使用する Zod スキーマ
 * @returns ミドルウェア関数
 */
export const validateParams2 = <T extends Record<string, string | undefined>>(schema: ZodType<T>) =>
  async (passable: Passable, next: NextFunction<Passable, Passable>): Promise<Passable> => {
    const result = schema.safeParse(passable.request.params)
    if (!result.success) throw new ValidationError(result.error)
    return next(passable.mergeParams(result.data as Record<string, string>))
  }

/**
 * query パラメータを Zod スキーマで検証するミドルウェアを生成する。
 * 検証成功時は parsed result を passable.query にマージして next へ渡す。
 * 検証失敗時は ValidationError をスローし、postInvocation フックが 400 に変換する。
 * @param schema - 検証に使用する Zod スキーマ
 * @returns ミドルウェア関数
 */
export const validateQuery2 = <T extends Record<string, string>>(schema: ZodType<T>) =>
  async (passable: Passable, next: NextFunction<Passable, Passable>): Promise<Passable> => {
    const query = Object.fromEntries(passable.request.query.entries())
    const result = schema.safeParse(query)
    if (!result.success) throw new ValidationError(result.error)
    return next(passable.mergeQuery(result.data))
  }

/**
 * リクエストボディを Zod スキーマで検証するミドルウェアを生成する。
 * 検証成功時は parsed result を passable.body にマージして next へ渡す。
 * 検証失敗時は ValidationError をスローし、postInvocation フックが 400 に変換する。
 * @param schema - 検証に使用する Zod スキーマ
 * @returns ミドルウェア関数
 */
export const validateBody = <T>(schema: SchemaOrFactory<T>) =>
  async (passable: Passable, next: NextFunction<Passable, Passable>): Promise<Passable> => {
    const resolved = typeof schema === 'function' ? schema(passable.request) : schema
    const result = resolved.safeParse(await passable.request.json())
    if (!result.success) throw new ValidationError(result.error)
    return next(passable.setBody(result.data))
  }
