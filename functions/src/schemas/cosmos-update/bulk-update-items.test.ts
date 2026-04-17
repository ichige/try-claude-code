import { BulkOperationType, PatchOperationType } from '@azure/cosmos'
import { describe, expect, it } from 'vitest'
import { bulkUpdateItemSchema, bulkUpdateItemsBodySchema, bulkUpdateItemsParamsSchema } from './bulk-update-items'

const validId = '6e0b379b-5998-4e91-ba20-443e861b5b8a'
const validEtag = '"abc123"'
const isoPattern = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d+Z$/

const validItem = { id: validId, pk: 'pk-consignors', _etag: validEtag }

describe('bulkUpdateItemsParamsSchema', () => {
  it('有効なコンテナ名を受け入れる', () => {
    expect(bulkUpdateItemsParamsSchema.safeParse({ container: 'Consignors' }).success).toBe(true)
  })

  it('無効なコンテナ名を拒否する', () => {
    expect(bulkUpdateItemsParamsSchema.safeParse({ container: 'Unknown' }).success).toBe(false)
  })
})

describe('bulkUpdateItemSchema', () => {
  describe('operationType の注入', () => {
    it('operationType: Patch を注入する', () => {
      const result = bulkUpdateItemSchema.safeParse(validItem)
      expect(result.success && result.data.operationType).toBe(BulkOperationType.Patch)
    })
  })

  describe('id の参照', () => {
    it('id を operationInput に直接セットする', () => {
      const result = bulkUpdateItemSchema.safeParse(validItem)
      expect(result.success && result.data.id).toBe(validId)
    })

    it('無効な UUID を拒否する', () => {
      expect(bulkUpdateItemSchema.safeParse({ ...validItem, id: 'not-a-uuid' }).success).toBe(false)
    })
  })

  describe('resourceBody（patch operations）の構造', () => {
    it('resourceBody は { operations } 形式になる', () => {
      const result = bulkUpdateItemSchema.safeParse({ ...validItem, name: 'テスト' })
      expect(result.success && Array.isArray((result.data.resourceBody as any).operations)).toBe(true)
    })

    it('任意フィールドが set operation に変換される', () => {
      const result = bulkUpdateItemSchema.safeParse({ ...validItem, name: 'テスト', code: 'test-001' })
      expect(result.success).toBe(true)
      const ops = result.success ? (result.data.resourceBody as any).operations as any[] : []
      expect(ops).toContainEqual({ op: PatchOperationType.set, path: '/name', value: 'テスト' })
      expect(ops).toContainEqual({ op: PatchOperationType.set, path: '/code', value: 'test-001' })
    })

    it('updatedAt はリクエスト値を無視して現在時刻の set operation になる', () => {
      const result = bulkUpdateItemSchema.safeParse({ ...validItem, updatedAt: '2000-01-01T00:00:00.000Z' })
      expect(result.success).toBe(true)
      const ops = result.success ? (result.data.resourceBody as any).operations as any[] : []
      const updatedAtOp = ops.find(o => o.path === '/updatedAt')
      expect(updatedAtOp?.value).toMatch(isoPattern)
      expect(updatedAtOp?.value).not.toBe('2000-01-01T00:00:00.000Z')
    })

    it('id / pk / _etag は patch operation に含まれない', () => {
      const result = bulkUpdateItemSchema.safeParse(validItem)
      expect(result.success).toBe(true)
      const ops = result.success ? (result.data.resourceBody as any).operations as any[] : []
      const paths = ops.map(o => o.path)
      expect(paths).not.toContain('/id')
      expect(paths).not.toContain('/pk')
      expect(paths).not.toContain('/_etag')
    })
  })

  describe('isDeleted / deletedAt の連動', () => {
    it('isDeleted: true のとき deletedAt を現在時刻の set operation に変換する', () => {
      const result = bulkUpdateItemSchema.safeParse({ ...validItem, isDeleted: true })
      expect(result.success).toBe(true)
      const ops = result.success ? (result.data.resourceBody as any).operations as any[] : []
      const deletedAtOp = ops.find(o => o.path === '/deletedAt')
      expect(deletedAtOp?.value).toMatch(isoPattern)
    })

    it('isDeleted: false のとき deletedAt: null の set operation に変換する', () => {
      const result = bulkUpdateItemSchema.safeParse({ ...validItem, isDeleted: false })
      expect(result.success).toBe(true)
      const ops = result.success ? (result.data.resourceBody as any).operations as any[] : []
      const deletedAtOp = ops.find(o => o.path === '/deletedAt')
      expect(deletedAtOp?.value).toBeNull()
    })

    it('isDeleted 未指定のとき deletedAt operation を含まない', () => {
      const result = bulkUpdateItemSchema.safeParse(validItem)
      expect(result.success).toBe(true)
      const ops = result.success ? (result.data.resourceBody as any).operations as any[] : []
      const paths = ops.map(o => o.path)
      expect(paths).not.toContain('/deletedAt')
    })

    it('isDeleted に boolean 以外を拒否する', () => {
      expect(bulkUpdateItemSchema.safeParse({ ...validItem, isDeleted: 'true' }).success).toBe(false)
    })
  })

  describe('partitionKey / ifMatch の変換', () => {
    it('pk を partitionKey に変換する', () => {
      const result = bulkUpdateItemSchema.safeParse(validItem)
      expect(result.success && result.data.partitionKey).toBe('pk-consignors')
    })

    it('_etag を ifMatch に変換する', () => {
      const result = bulkUpdateItemSchema.safeParse(validItem)
      expect(result.success && result.data.ifMatch).toBe(validEtag)
    })
  })

  describe('必須フィールドのバリデーション', () => {
    it('pk 未指定を拒否する', () => {
      expect(bulkUpdateItemSchema.safeParse({ id: validId, _etag: validEtag }).success).toBe(false)
    })

    it('_etag 未指定を拒否する', () => {
      expect(bulkUpdateItemSchema.safeParse({ id: validId, pk: 'pk-consignors' }).success).toBe(false)
    })
  })
})

describe('bulkUpdateItemsBodySchema', () => {
  it('アイテム配列を受け入れる', () => {
    const result = bulkUpdateItemsBodySchema.safeParse([
      validItem,
      { id: 'a42bf96f-1a69-4530-9575-d1e5181f8c86', pk: 'pk-consignors', _etag: '"def456"' },
    ])
    expect(result.success).toBe(true)
  })

  it('空配列を受け入れる', () => {
    expect(bulkUpdateItemsBodySchema.safeParse([]).success).toBe(true)
  })

  it('無効なアイテムを含む配列を拒否する', () => {
    expect(bulkUpdateItemsBodySchema.safeParse([{ id: 'bad', pk: 'pk-consignors', _etag: validEtag }]).success).toBe(false)
  })

  it('各アイテムに operationType: Patch を注入する', () => {
    const result = bulkUpdateItemsBodySchema.safeParse([validItem])
    expect(result.success && result.data[0].operationType).toBe(BulkOperationType.Patch)
  })
})
