import type { ZodType } from 'zod'
import { ValidationError } from '../../errors'
import type { NextFunction } from '../../shared'
import type { Passable } from '../../lib/passable'

/**
 * リクエストの query パラメータを Zod スキーマで検証するミドルウェアを生成する。
 * 検証成功時は parsed result を passable.query にマージして next へ渡す。
 * 検証失敗時は ValidationError をスローし、postInvocation フックが 400 に変換する。
 * @param schema - 検証に使用する Zod スキーマ
 * @returns ミドルウェア関数
 */
export const validateQuery = <T extends Record<string, string>>(schema: ZodType<T>) =>
  async (passable: Passable, next: NextFunction<Passable, Passable>): Promise<Passable> => {
    const query = Object.fromEntries(passable.request.query.entries())
    const result = schema.safeParse(query)
    if (!result.success) throw new ValidationError(result.error)
    return next(passable.mergeQuery(result.data))
  }
