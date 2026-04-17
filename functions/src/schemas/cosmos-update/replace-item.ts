import { z } from 'zod'
import { itemParamsSchema } from '../item-params'

/**
 * replaceItem エンドポイントのパスパラメータスキーマ。
 * pk は省略時にコンテナ名から導出する。
 */
export const replaceItemParamsSchema = itemParamsSchema

/**
 * 単一アイテムの置換スキーマ（replaceItemBodySchema / bulkReplaceItemsBodySchema で共用）。
 * id / pk / _etag は必須。
 * updatedAt はリクエスト値を無視してサーバ側で現在時刻に上書きする。
 * その他のフィールドは任意の値を受け付ける。
 * _etag はアクションで accessCondition / ifMatch に使用するためそのまま出力に残す。
 */
export const replaceItemSchema = z
  .object({
    id: z.uuid(),
    pk: z.string(),
    _etag: z.string(),
    createdAt: z.iso.datetime(),
  })
  .catchall(z.unknown())
  .transform(({ updatedAt: _, ...rest }) => ({
    ...rest,
    updatedAt: new Date().toISOString(),
  }))

/** replaceItem エンドポイントのリクエストボディスキーマ。 */
export const replaceItemBodySchema = replaceItemSchema
