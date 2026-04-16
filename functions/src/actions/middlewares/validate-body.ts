import type { HttpRequest } from '@azure/functions'
import type { ZodType } from 'zod'
import { ValidationError } from '../../errors'
import type { AsyncMiddleware } from '../../shared'

/** validateBody で parsed result を付与した拡張リクエスト */
export type EnrichedRequestBody<T> = HttpRequest & { safeBody: T }

/** スキーマ、またはリクエストからスキーマを生成するファクトリ関数 */
export type SchemaOrFactory = ZodType | ((req: HttpRequest) => ZodType)

/**
 * リクエストボディを Zod スキーマで検証するミドルウェア。
 * 検証成功時は parsed result を safeBody として付与して next へ渡す。
 * 検証失敗時は ValidationError をスローし、postInvocation フックが 400 に変換する。
 * @param req - HTTP リクエスト
 * @param next - 次のミドルウェアまたは destination
 * @param schema - 検証に使用する Zod スキーマ、またはリクエストからスキーマを生成するファクトリ関数
 */
export const validateBody: AsyncMiddleware<HttpRequest, HttpRequest, HttpRequest, SchemaOrFactory> =
  async (req, next, schema) => {
    const resolved = typeof schema === 'function' ? schema(req) : schema
    const result = resolved.safeParse(await req.json())
    if (!result.success) throw new ValidationError(result.error)
    return next(Object.assign(req, { safeBody: result.data }))
  }
