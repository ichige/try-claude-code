import type { Resource } from '@azure/cosmos'
import type { HttpRequest, HttpResponseInit } from '@azure/functions'
import type { AsyncMiddleware, CosmosItem } from '../../shared'

/**
 * Cosmos DB のシステムプロパティを除外する。
 * @param item - Cosmos DB から取得したアイテム
 * @returns システムプロパティを除いたアイテム
 */
function stripSystemProps({ _rid, _ts, _self, _attachments, ...item }: CosmosItem & Resource): CosmosItem {
  return item
}

/**
 * next が返した CosmosItem を 200 レスポンスに変換するミドルウェア。
 * Cosmos DB のシステムプロパティ (_rid, _ts, _self, _attachments) を除外し、_etag のみ残す。
 * @param req - HTTP リクエスト
 * @param next - 次のミドルウェアまたは destination
 * @returns 200 レスポンス
 */
export const toResponse: AsyncMiddleware<HttpRequest, HttpResponseInit, CosmosItem & Resource> =
  async (req, next) => {
    const item = stripSystemProps(await next(req))
    return { status: 200, jsonBody: { item } }
  }

/**
 * next が返した CosmosItem の配列を 200 レスポンスに変換するミドルウェア。
 * 各アイテムから Cosmos DB のシステムプロパティを除外する。
 * @param req - HTTP リクエスト
 * @param next - 次のミドルウェアまたは destination
 * @returns 200 レスポンス
 */
export const toResponses: AsyncMiddleware<HttpRequest, HttpResponseInit, (CosmosItem & Resource)[]> =
  async (req, next) => {
    const items = (await next(req)).map(stripSystemProps)
    return { status: 200, jsonBody: { items } }
  }
