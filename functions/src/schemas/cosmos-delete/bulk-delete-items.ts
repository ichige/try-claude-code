import { BulkOperationType } from '@azure/cosmos'
import { z } from 'zod'
import { containerSchema } from '../container'

/**
 * bulkDeleteItems エンドポイントのパスパラメータスキーマ。
 */
export const bulkDeleteItemsParamsSchema = z.object({
  container: containerSchema,
})

/**
 * バルク削除の各アイテムスキーマ。
 * transform で operationType を注入し、SDK が要求する partitionKey に変換する。
 */
export const bulkDeleteItemSchema = z.object({
  id: z.uuid(),
  pk: z.string(),
}).transform(({ id, pk }) => ({
  operationType: BulkOperationType.Delete,
  id,
  partitionKey: pk,
}))

/** バルク削除リクエストボディスキーマ（アイテムの配列）。 */
export const bulkDeleteItemsBodySchema = z.array(bulkDeleteItemSchema)
