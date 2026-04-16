import { BulkOperationType } from '@azure/cosmos'
import { describe, expect, it } from 'vitest'
import { bulkDeleteItemSchema, bulkDeleteItemsBodySchema, bulkDeleteItemsParamsSchema } from './bulk-delete-items'

const validId = '6e0b379b-5998-4e91-ba20-443e861b5b8a'

describe('bulkDeleteItemsParamsSchema', () => {
  it('有効なコンテナ名を受け入れる', () => {
    expect(bulkDeleteItemsParamsSchema.safeParse({ container: 'Consignors' }).success).toBe(true)
  })

  it('無効なコンテナ名を拒否する', () => {
    expect(bulkDeleteItemsParamsSchema.safeParse({ container: 'Unknown' }).success).toBe(false)
  })
})

describe('bulkDeleteItemSchema', () => {
  it('operationType: Delete を注入する', () => {
    const result = bulkDeleteItemSchema.safeParse({ id: validId, pk: 'pk-consignors' })
    expect(result.success && result.data.operationType).toBe(BulkOperationType.Delete)
  })

  it('pk を partitionKey に変換する', () => {
    const result = bulkDeleteItemSchema.safeParse({ id: validId, pk: 'pk-consignors' })
    expect(result.success && result.data.partitionKey).toBe('pk-consignors')
  })

  it('無効な UUID を拒否する', () => {
    expect(bulkDeleteItemSchema.safeParse({ id: 'not-a-uuid', pk: 'pk-consignors' }).success).toBe(false)
  })

  it('pk 未指定を拒否する', () => {
    expect(bulkDeleteItemSchema.safeParse({ id: validId }).success).toBe(false)
  })
})

describe('bulkDeleteItemsBodySchema', () => {
  it('アイテム配列を受け入れる', () => {
    const result = bulkDeleteItemsBodySchema.safeParse([
      { id: validId, pk: 'pk-consignors' },
      { id: 'a42bf96f-1a69-4530-9575-d1e5181f8c86', pk: 'pk-consignors' },
    ])
    expect(result.success).toBe(true)
  })

  it('空配列を受け入れる', () => {
    expect(bulkDeleteItemsBodySchema.safeParse([]).success).toBe(true)
  })

  it('無効なアイテムを含む配列を拒否する', () => {
    expect(bulkDeleteItemsBodySchema.safeParse([{ id: 'bad', pk: 'pk-consignors' }]).success).toBe(false)
  })
})
