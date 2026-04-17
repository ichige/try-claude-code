import { BulkOperationType, PatchOperationType } from '@azure/cosmos'
import { z } from 'zod'
import { containerSchema } from '../container'
import { applyUpdateFields } from './update-item'

/**
 * bulkUpdateItems エンドポイントのパスパラメータスキーマ。
 */
export const bulkUpdateItemsParamsSchema = z.object({
  container: containerSchema,
})

/**
 * バルク更新の各アイテムスキーマ。
 * applyUpdateFields で updatedAt / isDeleted / deletedAt を解決し、
 * 各フィールドを Cosmos DB patch operation に変換する。
 * id / pk / _etag はパッチ対象から除外し、operationInput のメタデータとして使用する。
 */
export const bulkUpdateItemSchema = z
  .object({
    id: z.uuid(),
    pk: z.string(),
    _etag: z.string(),
    isDeleted: z.boolean().optional(),
  })
  .catchall(z.unknown())
  .transform((data) => {
    const { id, pk, _etag, ...fields } = applyUpdateFields(data)
    const operations = Object.entries(fields).map(([key, value]) => ({
      op: PatchOperationType.set,
      path: `/${key}`,
      value,
    }))
    return {
      operationType: BulkOperationType.Patch,
      id: String(id),
      resourceBody: { operations },
      partitionKey: String(pk),
      ifMatch: String(_etag),
    }
  })

/** バルク更新リクエストボディスキーマ（アイテムの配列）。 */
export const bulkUpdateItemsBodySchema = z.array(bulkUpdateItemSchema)
