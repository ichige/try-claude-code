import { BulkOperationType } from '@azure/cosmos'
import { z } from 'zod'
import { containerSchema } from '../container'
import { replaceItemSchema } from './replace-item'

/**
 * bulkReplaceItems エンドポイントのパスパラメータスキーマ。
 */
export const bulkReplaceItemsParamsSchema = z.object({
  container: containerSchema,
})

/**
 * バルク置換の各アイテムスキーマ。
 * replaceItemSchema をベースに operationType を注入し、
 * _etag を ifMatch に変換して SDK が要求する形式に整形する。
 * _etag は Cosmos DB 管理のシステムプロパティのため resourceBody からは除外する。
 */
export const bulkReplaceItemSchema = replaceItemSchema.transform(({ _etag, ...body }) => ({
  operationType: BulkOperationType.Replace,
  id: body.id,
  resourceBody: body,
  partitionKey: body.pk as string,
  ifMatch: _etag,
}))

/** バルク置換リクエストボディスキーマ（アイテムの配列）。 */
export const bulkReplaceItemsBodySchema = z.array(bulkReplaceItemSchema)
