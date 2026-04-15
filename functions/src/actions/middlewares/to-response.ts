import type { HttpRequest, HttpResponseInit } from '@azure/functions'
import type { AsyncMiddleware } from '../../shared'
import type { CosmosItem } from '../../types/cosmos'

/**
 * next が返した CosmosItem を 200 レスポンスに変換するミドルウェア。
 * @param req - HTTP リクエスト
 * @param next - 次のミドルウェアまたは destination
 * @returns 200 レスポンス
 */
export const toResponse: AsyncMiddleware<HttpRequest, HttpResponseInit, CosmosItem> =
  async (req, next) => {
    const item = await next(req)
    return { status: 200, jsonBody: { item } }
  }
