import { describe, expect, it } from 'vitest'
import { Tariff } from './tariff'
import type { TariffsItem } from '@shisamo/shared'

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const makeItem = (ranges: TariffsItem['ranges']): TariffsItem => ({
  id: 'v1', pk: 'pk-tariffs', name: 'test', notes: '', enabled: false, isActive: true,
  ranges,
  createdAt: '', updatedAt: '', deletedAt: null, isDeleted: false, _etag: '',
})

// 1km〜20km: 基本500円、1km毎に100円加算
// 21km〜50km: 基本2500円、5km毎に200円加算
const item = makeItem([
  { minKm: 1,  maxKm: 20, baseFare: 500,  unitKm: 1, unitFare: 100 },
  { minKm: 21, maxKm: 50, baseFare: 2500, unitKm: 5, unitFare: 200 },
])

// ---------------------------------------------------------------------------
// calculate
// ---------------------------------------------------------------------------

describe('calculate', () => {
  it('0以下は null を返す', () => {
    expect(new Tariff(item).calculate(0)).toBeNull()
    expect(new Tariff(item).calculate(-1)).toBeNull()
  })

  it('範囲外は null を返す', () => {
    expect(new Tariff(item).calculate(51)).toBeNull()
  })

  it('レンジ下限値で計算できる', () => {
    // 1km: 500 + ceil((1-1)/1) * 100 = 500
    expect(new Tariff(item).calculate(1)).toBe(500)
  })

  it('レンジ内で計算できる', () => {
    // 10km: 500 + ceil((10-1)/1) * 100 = 500 + 900 = 1400
    expect(new Tariff(item).calculate(10)).toBe(1400)
  })

  it('レンジ上限値で計算できる', () => {
    // 20km: 500 + ceil((20-1)/1) * 100 = 500 + 1900 = 2400
    expect(new Tariff(item).calculate(20)).toBe(2400)
  })

  it('2つ目のレンジで計算できる', () => {
    // 21km: 2500 + ceil((21-21)/5) * 200 = 2500
    expect(new Tariff(item).calculate(21)).toBe(2500)
  })

  it('unitKm で切り上げが行われる', () => {
    // 23km: 2500 + ceil((23-21)/5) * 200 = 2500 + 1*200 = 2700
    expect(new Tariff(item).calculate(23)).toBe(2700)
  })
})
