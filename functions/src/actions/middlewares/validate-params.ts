import type { HttpRequest } from '@azure/functions'
import type { ZodType } from 'zod'
import { ValidationError } from '../../errors'
import type { AsyncMiddleware } from '../../shared'

/**
 * リクエストのパスパラメータを Zod スキーマで検証するミドルウェア。
 * 検証失敗時は ValidationError をスローし、postInvocation フックが 400 に変換する。
 * @param req - HTTP リクエスト
 * @param next - 次のミドルウェアまたは destination
 * @param schema - 検証に使用する Zod スキーマ
 */
export const validateParams: AsyncMiddleware<HttpRequest, HttpRequest, HttpRequest, ZodType> =
  async (req, next, schema) => {
    const result = schema.safeParse(req.params)
    if (!result.success) throw new ValidationError(result.error)
    return next(req)
  }
