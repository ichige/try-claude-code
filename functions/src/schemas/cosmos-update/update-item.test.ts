import { describe, expect, it } from 'vitest'
import { updateItemBodySchema, updateItemParamsSchema } from './update-item'

const validId = '6e0b379b-5998-4e91-ba20-443e861b5b8a'
const validEtag = '"abc123"'
const isoPattern = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d+Z$/

describe('updateItemParamsSchema', () => {
  it('有効な container / id を受け入れる', () => {
    expect(updateItemParamsSchema.safeParse({ container: 'Consignors', id: validId }).success).toBe(true)
  })

  it('pk 省略時はコンテナ名から導出する', () => {
    const result = updateItemParamsSchema.safeParse({ container: 'Consignors', id: validId })
    expect(result.success && result.data.pk).toBe('pk-consignors')
  })

  it('無効なコンテナ名を拒否する', () => {
    expect(updateItemParamsSchema.safeParse({ container: 'Unknown', id: validId }).success).toBe(false)
  })

  it('無効な UUID を拒否する', () => {
    expect(updateItemParamsSchema.safeParse({ container: 'Consignors', id: 'not-a-uuid' }).success).toBe(false)
  })
})

describe('updateItemBodySchema', () => {
  describe('必須フィールドのバリデーション', () => {
    it('_etag のみでも受け入れる', () => {
      expect(updateItemBodySchema.safeParse({ _etag: validEtag }).success).toBe(true)
    })

    it('_etag 未指定を拒否する', () => {
      expect(updateItemBodySchema.safeParse({}).success).toBe(false)
    })
  })

  describe('updatedAt の上書き', () => {
    it('updatedAt はリクエスト値を無視して現在時刻を設定する', () => {
      const result = updateItemBodySchema.safeParse({ _etag: validEtag, updatedAt: '2000-01-01T00:00:00.000Z' })
      expect(result.success && result.data.updatedAt).toMatch(isoPattern)
      expect(result.success && result.data.updatedAt).not.toBe('2000-01-01T00:00:00.000Z')
    })

    it('updatedAt 未指定でも現在時刻を設定する', () => {
      const result = updateItemBodySchema.safeParse({ _etag: validEtag })
      expect(result.success && result.data.updatedAt).toMatch(isoPattern)
    })
  })

  describe('isDeleted / deletedAt の連動', () => {
    it('isDeleted: true のとき deletedAt を現在時刻に設定する', () => {
      const result = updateItemBodySchema.safeParse({ _etag: validEtag, isDeleted: true })
      expect(result.success && result.data.deletedAt).toMatch(isoPattern)
    })

    it('isDeleted: false のとき deletedAt を null に設定する', () => {
      const result = updateItemBodySchema.safeParse({ _etag: validEtag, isDeleted: false })
      expect(result.success && result.data.deletedAt).toBeNull()
    })

    it('isDeleted 未指定のとき deletedAt を出力しない', () => {
      const result = updateItemBodySchema.safeParse({ _etag: validEtag })
      expect(result.success && 'deletedAt' in result.data).toBe(false)
    })

    it('isDeleted に boolean 以外を拒否する', () => {
      expect(updateItemBodySchema.safeParse({ _etag: validEtag, isDeleted: 'true' }).success).toBe(false)
    })
  })

  describe('_etag の保持', () => {
    it('_etag を出力に残す', () => {
      const result = updateItemBodySchema.safeParse({ _etag: validEtag })
      expect(result.success && result.data._etag).toBe(validEtag)
    })
  })

  describe('任意フィールド', () => {
    it('任意のフィールドをそのまま通過させる', () => {
      const result = updateItemBodySchema.safeParse({ _etag: validEtag, name: 'テスト', code: 'test-001' })
      expect(result.success && result.data).toMatchObject({ name: 'テスト', code: 'test-001' })
    })
  })
})
