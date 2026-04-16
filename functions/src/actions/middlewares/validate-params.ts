import type { HttpRequest } from '@azure/functions'
import type { ZodType } from 'zod'
import { ValidationError } from '../../errors'
import type { AsyncMiddleware } from '../../shared'

/** validateParams で parsed result を付与した拡張リクエスト */
export type EnrichedRequest<T> = HttpRequest & { safeData: T }

/**
 * リクエストのパスパラメータを Zod スキーマで検証するミドルウェア。
 * 検証成功時は parsed result を safeData として付与して next へ渡す。
 * 検証失敗時は ValidationError をスローし、postInvocation フックが 400 に変換する。
 * @param req - HTTP リクエスト
 * @param next - 次のミドルウェアまたは destination
 * @param schema - 検証に使用する Zod スキーマ
 */
export const validateParams: AsyncMiddleware<HttpRequest, HttpRequest, HttpRequest, ZodType> =
  async (req, next, schema) => {
    const result = schema.safeParse(req.params)
    if (!result.success) throw new ValidationError(result.error)
    return next(Object.assign(req, { safeData: result.data }))
  }
