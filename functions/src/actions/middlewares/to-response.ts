import type { Resource } from '@azure/cosmos'
import type { HttpRequest, HttpResponseInit } from '@azure/functions'
import type { AsyncMiddleware, CosmosItem } from '../../shared'

/**
 * next が返した CosmosItem を 200 レスポンスに変換するミドルウェア。
 * Cosmos DB のシステムプロパティ (_rid, _ts, _self) を除外し、_etag のみ残す。
 * @param req - HTTP リクエスト
 * @param next - 次のミドルウェアまたは destination
 * @returns 200 レスポンス
 */
export const toResponse: AsyncMiddleware<HttpRequest, HttpResponseInit, CosmosItem & Resource> =
  async (req, next) => {
    const { _rid, _ts, _self, _attachments, ...item } = await next(req)
    return { status: 200, jsonBody: { item } }
  }
