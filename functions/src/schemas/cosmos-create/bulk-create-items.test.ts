import { BulkOperationType } from '@azure/cosmos'
import { describe, expect, it } from 'vitest'
import { bulkCreateItemSchema, bulkCreateItemsBodySchema, bulkCreateItemsParamsSchema } from './bulk-create-items'

const validId = '6e0b379b-5998-4e91-ba20-443e861b5b8a'
const isoPattern = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d+Z$/

const mockReq = (container: string) => ({ safeData: { container } }) as any
const schema = bulkCreateItemSchema('Consignors')

describe('bulkCreateItemsParamsSchema', () => {
  it('有効なコンテナ名を受け入れる', () => {
    expect(bulkCreateItemsParamsSchema.safeParse({ container: 'Consignors' }).success).toBe(true)
  })

  it('無効なコンテナ名を拒否する', () => {
    expect(bulkCreateItemsParamsSchema.safeParse({ container: 'Unknown' }).success).toBe(false)
  })
})

describe('bulkCreateItemSchema', () => {
  describe('operationType の注入', () => {
    it('operationType: Create を注入する', () => {
      const result = schema.safeParse({})
      expect(result.success && result.data.operationType).toBe(BulkOperationType.Create)
    })
  })

  describe('resourceBody の構造', () => {
    it('resourceBody にアイテムデータを格納する', () => {
      const result = schema.safeParse({ id: validId, pk: 'pk-consignors' })
      expect(result.success && result.data.resourceBody).toMatchObject({ id: validId, pk: 'pk-consignors' })
    })

    it('id 未指定の場合は UUID を自動発行する', () => {
      const result = schema.safeParse({})
      expect(result.success && result.data.resourceBody.id).toMatch(
        /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/,
      )
    })

    it('id を指定した場合はその値を使用する', () => {
      const result = schema.safeParse({ id: validId })
      expect(result.success && result.data.resourceBody.id).toBe(validId)
    })

    it('無効な UUID を拒否する', () => {
      expect(schema.safeParse({ id: 'not-a-uuid' }).success).toBe(false)
    })

    it('pk 未指定の場合はコンテナ名から導出する', () => {
      const result = schema.safeParse({})
      expect(result.success && result.data.resourceBody.pk).toBe('pk-consignors')
    })

    it.each([
      ['Consignees', 'pk-consignees'],
      ['Carriers', 'pk-carriers'],
      ['Forwarders', 'pk-forwarders'],
      ['Consignors', 'pk-consignors'],
    ])('container "%s" → pk "%s"', (container, expectedPk) => {
      const result = bulkCreateItemSchema(container).safeParse({})
      expect(result.success && result.data.resourceBody.pk).toBe(expectedPk)
    })

    it('createdAt はサーバ側で現在時刻を設定する', () => {
      const result = schema.safeParse({ createdAt: '2000-01-01T00:00:00.000Z' })
      expect(result.success && result.data.resourceBody.createdAt).toMatch(isoPattern)
      expect(result.success && result.data.resourceBody.createdAt).not.toBe('2000-01-01T00:00:00.000Z')
    })

    it('_etag は resourceBody から除外する', () => {
      const result = schema.safeParse({ _etag: '"abc123"' })
      expect(result.success && '_etag' in result.data.resourceBody).toBe(false)
    })
  })

  describe('partitionKey の変換', () => {
    it('pk を partitionKey に変換する', () => {
      const result = schema.safeParse({ pk: 'pk-consignors' })
      expect(result.success && result.data.partitionKey).toBe('pk-consignors')
    })

    it('pk 未指定の場合は導出した pk を partitionKey に使用する', () => {
      const result = schema.safeParse({})
      expect(result.success && result.data.partitionKey).toBe('pk-consignors')
    })
  })
})

describe('bulkCreateItemsBodySchema', () => {
  it('アイテム配列を受け入れる', () => {
    const result = bulkCreateItemsBodySchema(mockReq('Consignors')).safeParse([
      { id: validId, pk: 'pk-consignors' },
      { id: 'a42bf96f-1a69-4530-9575-d1e5181f8c86', pk: 'pk-consignors' },
    ])
    expect(result.success).toBe(true)
  })

  it('空配列を受け入れる', () => {
    expect(bulkCreateItemsBodySchema(mockReq('Consignors')).safeParse([]).success).toBe(true)
  })

  it('無効なアイテムを含む配列を拒否する', () => {
    expect(
      bulkCreateItemsBodySchema(mockReq('Consignors')).safeParse([{ id: 'bad', pk: 'pk-consignors' }]).success,
    ).toBe(false)
  })

  it('各アイテムに operationType: Create を注入する', () => {
    const result = bulkCreateItemsBodySchema(mockReq('Consignors')).safeParse([{ id: validId }])
    expect(result.success && result.data[0].operationType).toBe(BulkOperationType.Create)
  })
})
