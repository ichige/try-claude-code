import { describe, expect, it } from 'vitest'
import { replaceItemBodySchema, replaceItemParamsSchema } from './replace-item'

const validId = '6e0b379b-5998-4e91-ba20-443e861b5b8a'
const validEtag = '"abc123"'
const isoPattern = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d+Z$/

describe('replaceItemParamsSchema', () => {
  describe('有効な入力', () => {
    it('container / id を受け入れる', () => {
      expect(replaceItemParamsSchema.safeParse({ container: 'Consignors', id: validId }).success).toBe(true)
    })

    it('pk を明示した場合はその値を使用する', () => {
      const result = replaceItemParamsSchema.safeParse({ container: 'Consignors', id: validId, pk: 'custom-pk' })
      expect(result.success && result.data.pk).toBe('custom-pk')
    })

    it('pk 省略時はコンテナ名から導出する', () => {
      const result = replaceItemParamsSchema.safeParse({ container: 'Consignors', id: validId })
      expect(result.success && result.data.pk).toBe('pk-consignors')
    })

    it.each([
      ['Consignees', 'pk-consignees'],
      ['Carriers', 'pk-carriers'],
      ['Forwarders', 'pk-forwarders'],
      ['Consignors', 'pk-consignors'],
    ])('container "%s" → pk "%s"', (container, expectedPk) => {
      const result = replaceItemParamsSchema.safeParse({ container, id: validId })
      expect(result.success && result.data.pk).toBe(expectedPk)
    })
  })

  describe('無効な入力', () => {
    it('無効なコンテナ名を拒否する', () => {
      expect(replaceItemParamsSchema.safeParse({ container: 'Unknown', id: validId }).success).toBe(false)
    })

    it('無効な UUID を拒否する', () => {
      expect(replaceItemParamsSchema.safeParse({ container: 'Consignors', id: 'not-a-uuid' }).success).toBe(false)
    })

    it('id 未指定を拒否する', () => {
      expect(replaceItemParamsSchema.safeParse({ container: 'Consignors' }).success).toBe(false)
    })
  })
})

describe('replaceItemBodySchema', () => {
  describe('必須フィールドのバリデーション', () => {
    it('id / pk / _etag がすべて揃った場合は受け入れる', () => {
      expect(
        replaceItemBodySchema.safeParse({ id: validId, pk: 'pk-consignors', _etag: validEtag }).success,
      ).toBe(true)
    })

    it('id 未指定を拒否する', () => {
      expect(replaceItemBodySchema.safeParse({ pk: 'pk-consignors', _etag: validEtag }).success).toBe(false)
    })

    it('無効な UUID を拒否する', () => {
      expect(replaceItemBodySchema.safeParse({ id: 'not-a-uuid', pk: 'pk-consignors', _etag: validEtag }).success).toBe(false)
    })

    it('pk 未指定を拒否する', () => {
      expect(replaceItemBodySchema.safeParse({ id: validId, _etag: validEtag }).success).toBe(false)
    })

    it('_etag 未指定を拒否する', () => {
      expect(replaceItemBodySchema.safeParse({ id: validId, pk: 'pk-consignors' }).success).toBe(false)
    })
  })

  describe('updatedAt の上書き', () => {
    it('updatedAt はリクエスト値を無視して現在時刻を設定する', () => {
      const result = replaceItemBodySchema.safeParse({
        id: validId, pk: 'pk-consignors', _etag: validEtag,
        updatedAt: '2000-01-01T00:00:00.000Z',
      })
      expect(result.success && result.data.updatedAt).toMatch(isoPattern)
      expect(result.success && result.data.updatedAt).not.toBe('2000-01-01T00:00:00.000Z')
    })

    it('updatedAt 未指定でも現在時刻を設定する', () => {
      const result = replaceItemBodySchema.safeParse({ id: validId, pk: 'pk-consignors', _etag: validEtag })
      expect(result.success && result.data.updatedAt).toMatch(isoPattern)
    })
  })

  describe('_etag の保持', () => {
    it('_etag を出力に残す', () => {
      const result = replaceItemBodySchema.safeParse({ id: validId, pk: 'pk-consignors', _etag: validEtag })
      expect(result.success && result.data._etag).toBe(validEtag)
    })
  })

  describe('任意フィールド', () => {
    it('任意のフィールドをそのまま通過させる', () => {
      const result = replaceItemBodySchema.safeParse({
        id: validId, pk: 'pk-consignors', _etag: validEtag,
        name: 'テスト', code: 'test-001',
      })
      expect(result.success && result.data).toMatchObject({ name: 'テスト', code: 'test-001' })
    })
  })
})
