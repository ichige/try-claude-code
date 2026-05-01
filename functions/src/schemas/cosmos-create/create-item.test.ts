import { describe, expect, it } from 'vitest'
import { createItemBodySchema, createItemParamsSchema } from './create-item'

const validId = '6e0b379b-5998-4e91-ba20-443e861b5b8a'
const isoPattern = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d+Z$/

const mockReq = (container: string) => ({ params: { container } }) as any
const schema = createItemBodySchema(mockReq('Consignors'))

describe('createItemParamsSchema', () => {
  it('有効なコンテナ名を受け入れる', () => {
    expect(createItemParamsSchema.safeParse({ container: 'Consignors' }).success).toBe(true)
  })

  it('無効なコンテナ名を拒否する', () => {
    expect(createItemParamsSchema.safeParse({ container: 'Unknown' }).success).toBe(false)
  })
})

describe('createItemBodySchema', () => {
  describe('id の発行', () => {
    it('id 未指定の場合は UUID を自動発行する', () => {
      const result = schema.safeParse({})
      expect(result.success && result.data.id).toMatch(
        /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/,
      )
    })

    it('id を指定した場合はその値を使用する', () => {
      const result = schema.safeParse({ id: validId })
      expect(result.success && result.data.id).toBe(validId)
    })
  })

  describe('pk の導出', () => {
    it('pk 未指定の場合はコンテナ名から導出する', () => {
      const result = schema.safeParse({})
      expect(result.success && result.data.pk).toBe('pk-consignors')
    })

    it('pk を指定した場合はその値を使用する', () => {
      const result = schema.safeParse({ pk: 'custom-pk' })
      expect(result.success && result.data.pk).toBe('custom-pk')
    })

    it.each([
      ['Consignees', 'pk-consignees'],
      ['Carriers', 'pk-carriers'],
      ['Forwarders', 'pk-forwarders'],
      ['Consignors', 'pk-consignors'],
    ])('container "%s" → pk "%s"', (container, expectedPk) => {
      const result = createItemBodySchema(mockReq(container)).safeParse({})
      expect(result.success && result.data.pk).toBe(expectedPk)
    })
  })

  describe('システムフィールドの上書き', () => {
    it('createdAt はリクエスト値を無視して現在時刻を設定する', () => {
      const result = schema.safeParse({ createdAt: '2000-01-01T00:00:00.000Z' })
      expect(result.success && result.data.createdAt).toMatch(isoPattern)
      expect(result.success && result.data.createdAt).not.toBe('2000-01-01T00:00:00.000Z')
    })

    it('updatedAt はリクエスト値を無視して現在時刻を設定する', () => {
      const result = schema.safeParse({ updatedAt: '2000-01-01T00:00:00.000Z' })
      expect(result.success && result.data.updatedAt).toMatch(isoPattern)
      expect(result.success && result.data.updatedAt).not.toBe('2000-01-01T00:00:00.000Z')
    })

    it('deletedAt はリクエスト値を無視して null を設定する', () => {
      const result = schema.safeParse({ deletedAt: '2000-01-01T00:00:00.000Z' })
      expect(result.success && result.data.deletedAt).toBeNull()
    })

    it('isDeleted はリクエスト値を無視して false を設定する', () => {
      const result = schema.safeParse({ isDeleted: true })
      expect(result.success && result.data.isDeleted).toBe(false)
    })

    it('_etag はリクエスト値があっても出力から除外する', () => {
      const result = schema.safeParse({ _etag: '"abc123"' })
      expect(result.success && '_etag' in result.data).toBe(false)
    })
  })

  describe('任意フィールド', () => {
    it('任意のフィールドをそのまま通過させる', () => {
      const result = schema.safeParse({ name: 'test', count: 42 })
      expect(result.success && result.data).toMatchObject({ name: 'test', count: 42 })
    })

    it('空オブジェクトを受け入れる', () => {
      expect(schema.safeParse({}).success).toBe(true)
    })
  })
})
