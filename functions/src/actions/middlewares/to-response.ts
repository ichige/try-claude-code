import type { Resource } from '@azure/cosmos'
import type { HttpRequest, HttpResponseInit } from '@azure/functions'
import type { AsyncMiddleware, CosmosItem } from '../../shared'
import type { Passable } from '../../lib/passable'

/**
 * Cosmos DB のシステムプロパティを除外する。
 * @param _rid - Cosmos DB 内部管理用のリソース ID
 * @param _ts - 最終更新タイムスタンプ
 * @param _self - リソースへの自己参照 URI
 * @param _attachments - レガシーの添付ファイル参照
 * @param item - 除外後の残りのフィールド
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

/**
 * next が返した CosmosItem を passable.response にセットするミドルウェア。
 * @param passable - パッサブルオブジェクト
 * @param next - 次のミドルウェアまたは destination
 * @returns passable
 */
export const toResponse2: AsyncMiddleware<Passable, Passable, CosmosItem & Resource> =
  async (passable, next) => {
    const item = stripSystemProps(await next(passable))
    passable.response = { status: 200, jsonBody: { item } }
    return passable
  }

/**
 * next が返した CosmosItem 配列を passable.response にセットするミドルウェア。
 * @param passable - パッサブルオブジェクト
 * @param next - 次のミドルウェアまたは destination
 * @returns passable
 */
export const toResponses2: AsyncMiddleware<Passable, Passable, (CosmosItem & Resource)[]> =
  async (passable, next) => {
    const items = (await next(passable)).map(stripSystemProps)
    passable.response = { status: 200, jsonBody: { items } }
    return passable
  }
