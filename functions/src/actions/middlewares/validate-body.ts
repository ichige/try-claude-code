import type { HttpRequest } from '@azure/functions'
import type { ZodType } from 'zod'
import { ValidationError } from '../../errors'
import type { AsyncMiddleware } from '../../shared'

/** validateBody で parsed result を付与した拡張リクエスト */
export type EnrichedRequestBody<T> = HttpRequest & { safeBody: T }

/**
 * リクエストボディを Zod スキーマで検証するミドルウェア。
 * 検証成功時は parsed result を safeBody として付与して next へ渡す。
 * 検証失敗時は ValidationError をスローし、postInvocation フックが 400 に変換する。
 * @param req - HTTP リクエスト
 * @param next - 次のミドルウェアまたは destination
 * @param schema - 検証に使用する Zod スキーマ
 */
export const validateBody: AsyncMiddleware<HttpRequest, HttpRequest, HttpRequest, ZodType> =
  async (req, next, schema) => {
    const result = schema.safeParse(await req.json())
    if (!result.success) throw new ValidationError(result.error)
    return next(Object.assign(req, { safeBody: result.data }))
  }
