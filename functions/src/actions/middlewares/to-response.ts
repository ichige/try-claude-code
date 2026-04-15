import type { HttpRequest, HttpResponseInit } from '@azure/functions'
import type { AsyncMiddleware } from '../../shared'
import type { CosmosItem } from '../../types/cosmos'

/**
 * next が返した CosmosItem を 200 レスポンスに変換するミドルウェア。
 * item が null の場合は null を返す。
 * @param req - HTTP リクエスト
 * @param next - 次のミドルウェアまたは destination
 * @returns 200 レスポンス、または null
 */
export const toResponse: AsyncMiddleware<HttpRequest, HttpResponseInit | null, CosmosItem | null> =
  async (req, next) => {
    const item = await next(req)
    if (!item) return null
    return { status: 200, jsonBody: { item } }
  }
