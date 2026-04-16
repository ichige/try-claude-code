import { describe, expect, it } from 'vitest'
import { getItemParamsSchema } from './get-item'

describe('getItemParamsSchema', () => {
  const validId = '6e0b379b-5998-4e91-ba20-443e861b5b8a'

  describe('pk の導出', () => {
    it('pk 未指定の場合はコンテナ名から導出する', () => {
      const result = getItemParamsSchema.safeParse({ container: 'Consignors', id: validId })
      expect(result.success && result.data.pk).toBe('pk-consignors')
    })

    it('pk を明示した場合はそのまま使用する', () => {
      const result = getItemParamsSchema.safeParse({ container: 'Consignors', id: validId, pk: 'custom-pk' })
      expect(result.success && result.data.pk).toBe('custom-pk')
    })

    it.each([
      ['Consignees', 'pk-consignees'],
      ['Carriers', 'pk-carriers'],
      ['Forwarders', 'pk-forwarders'],
      ['Consignors', 'pk-consignors'],
    ])('container "%s" → pk "%s"', (container, expectedPk) => {
      const result = getItemParamsSchema.safeParse({ container, id: validId })
      expect(result.success && result.data.pk).toBe(expectedPk)
    })
  })

  describe('バリデーション', () => {
    it('無効なコンテナ名を拒否する', () => {
      expect(getItemParamsSchema.safeParse({ container: 'Unknown', id: validId }).success).toBe(false)
    })

    it('無効な UUID を拒否する', () => {
      expect(getItemParamsSchema.safeParse({ container: 'Consignors', id: 'not-a-uuid' }).success).toBe(false)
    })
  })
})
