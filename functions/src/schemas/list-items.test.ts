import { describe, expect, it } from 'vitest'
import { listItemsParamsSchema } from './list-items'

describe('listItemsParamsSchema', () => {
  describe('バリデーション', () => {
    it('有効なコンテナ名を受け入れる', () => {
      expect(listItemsParamsSchema.safeParse({ container: 'Consignors' }).success).toBe(true)
    })

    it('無効なコンテナ名を拒否する', () => {
      expect(listItemsParamsSchema.safeParse({ container: 'Unknown' }).success).toBe(false)
    })
  })

  describe('pk', () => {
    it('pk 未指定でも成功する', () => {
      const result = listItemsParamsSchema.safeParse({ container: 'Consignors' })
      expect(result.success && result.data.pk).toBeUndefined()
    })

    it('pk 指定時はそのまま使用する', () => {
      const result = listItemsParamsSchema.safeParse({ container: 'Consignors', pk: 'pk-consignors' })
      expect(result.success && result.data.pk).toBe('pk-consignors')
    })
  })
})
