import { describe, expect, it } from 'vitest'
import { containerSchema } from './container'

describe('containerSchema', () => {
  it.each(['Consignees', 'Carriers', 'Forwarders', 'Consignors'])(
    '有効なコンテナ名 "%s" を受け入れる',
    (container) => {
      expect(containerSchema.safeParse(container).success).toBe(true)
    },
  )

  it('無効なコンテナ名を拒否する', () => {
    expect(containerSchema.safeParse('Unknown').success).toBe(false)
  })

  it('空文字を拒否する', () => {
    expect(containerSchema.safeParse('').success).toBe(false)
  })
})
