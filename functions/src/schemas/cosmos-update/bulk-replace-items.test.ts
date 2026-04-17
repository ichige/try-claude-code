import { BulkOperationType } from '@azure/cosmos'
import { describe, expect, it } from 'vitest'
import { bulkReplaceItemSchema, bulkReplaceItemsBodySchema, bulkReplaceItemsParamsSchema } from './bulk-replace-items'

const validId = '6e0b379b-5998-4e91-ba20-443e861b5b8a'
const validEtag = '"abc123"'
const validCreatedAt = '2024-01-01T00:00:00.000Z'
const isoPattern = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d+Z$/

const validItem = { id: validId, pk: 'pk-consignors', _etag: validEtag, createdAt: validCreatedAt }

describe('bulkReplaceItemsParamsSchema', () => {
  it('有効なコンテナ名を受け入れる', () => {
    expect(bulkReplaceItemsParamsSchema.safeParse({ container: 'Consignors' }).success).toBe(true)
  })

  it('無効なコンテナ名を拒否する', () => {
    expect(bulkReplaceItemsParamsSchema.safeParse({ container: 'Unknown' }).success).toBe(false)
  })
})

describe('bulkReplaceItemSchema', () => {
  describe('operationType の注入', () => {
    it('operationType: Replace を注入する', () => {
      const result = bulkReplaceItemSchema.safeParse(validItem)
      expect(result.success && result.data.operationType).toBe(BulkOperationType.Replace)
    })
  })

  describe('id の参照', () => {
    it('id を operationInput に直接セットする', () => {
      const result = bulkReplaceItemSchema.safeParse(validItem)
      expect(result.success && result.data.id).toBe(validId)
    })

    it('無効な UUID を拒否する', () => {
      expect(bulkReplaceItemSchema.safeParse({ ...validItem, id: 'not-a-uuid' }).success).toBe(false)
    })
  })

  describe('resourceBody の構造', () => {
    it('resourceBody にアイテムデータを格納する', () => {
      const result = bulkReplaceItemSchema.safeParse({ ...validItem, name: 'テスト' })
      expect(result.success && result.data.resourceBody).toMatchObject({ id: validId, pk: 'pk-consignors', name: 'テスト' })
    })

    it('_etag を resourceBody から除外する', () => {
      const result = bulkReplaceItemSchema.safeParse(validItem)
      expect(result.success && '_etag' in result.data.resourceBody).toBe(false)
    })

    it('updatedAt はリクエスト値を無視して現在時刻を設定する', () => {
      const result = bulkReplaceItemSchema.safeParse({ ...validItem, updatedAt: '2000-01-01T00:00:00.000Z' })
      expect(result.success && (result.data.resourceBody as any).updatedAt).toMatch(isoPattern)
      expect(result.success && (result.data.resourceBody as any).updatedAt).not.toBe('2000-01-01T00:00:00.000Z')
    })
  })

  describe('partitionKey / ifMatch の変換', () => {
    it('pk を partitionKey に変換する', () => {
      const result = bulkReplaceItemSchema.safeParse(validItem)
      expect(result.success && result.data.partitionKey).toBe('pk-consignors')
    })

    it('_etag を ifMatch に変換する', () => {
      const result = bulkReplaceItemSchema.safeParse(validItem)
      expect(result.success && result.data.ifMatch).toBe(validEtag)
    })
  })

  describe('必須フィールドのバリデーション', () => {
    it('pk 未指定を拒否する', () => {
      expect(bulkReplaceItemSchema.safeParse({ id: validId, _etag: validEtag, createdAt: validCreatedAt }).success).toBe(false)
    })

    it('_etag 未指定を拒否する', () => {
      expect(bulkReplaceItemSchema.safeParse({ id: validId, pk: 'pk-consignors', createdAt: validCreatedAt }).success).toBe(false)
    })

    it('createdAt 未指定を拒否する', () => {
      expect(bulkReplaceItemSchema.safeParse({ id: validId, pk: 'pk-consignors', _etag: validEtag }).success).toBe(false)
    })

    it('createdAt に ISO 日時以外の文字列を拒否する', () => {
      expect(bulkReplaceItemSchema.safeParse({ ...validItem, createdAt: 'not-a-date' }).success).toBe(false)
    })
  })
})

describe('bulkReplaceItemsBodySchema', () => {
  it('アイテム配列を受け入れる', () => {
    const result = bulkReplaceItemsBodySchema.safeParse([
      validItem,
      { id: 'a42bf96f-1a69-4530-9575-d1e5181f8c86', pk: 'pk-consignors', _etag: '"def456"', createdAt: validCreatedAt },
    ])
    expect(result.success).toBe(true)
  })

  it('空配列を受け入れる', () => {
    expect(bulkReplaceItemsBodySchema.safeParse([]).success).toBe(true)
  })

  it('無効なアイテムを含む配列を拒否する', () => {
    expect(bulkReplaceItemsBodySchema.safeParse([{ id: 'bad', pk: 'pk-consignors', _etag: validEtag, createdAt: validCreatedAt }]).success).toBe(false)
  })

  it('各アイテムに operationType: Replace を注入する', () => {
    const result = bulkReplaceItemsBodySchema.safeParse([validItem])
    expect(result.success && result.data[0].operationType).toBe(BulkOperationType.Replace)
  })
})
