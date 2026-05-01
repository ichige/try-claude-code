import { describe, expect, it } from 'vitest'
import { Charge } from './charge'
import type { ChargeItems } from '@shisamo/shared'

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const makeItems = (items: ChargeItems['items']): ChargeItems => ({
  id: 'v1', pk: 'pk-charges', name: 'test', notes: '', enabled: false, isActive: true,
  items,
  createdAt: '', updatedAt: '', deletedAt: null, isDeleted: false, _etag: '',
})

// ---------------------------------------------------------------------------
// calculator
// ---------------------------------------------------------------------------

describe('calculator', () => {
  it('存在しないコードは null を返す', () => {
    const charge = new Charge(makeItems([]))
    expect(charge.calculator('unknown')).toBeNull()
  })
})

// ---------------------------------------------------------------------------
// ChargeUnitCount
// ---------------------------------------------------------------------------

describe('ChargeUnitCount', () => {
  const charge = new Charge(makeItems([
    { code: 'delivery-count', label: '配送件数', unit: 'count', taxable: true, baseUnit: 1, minUnit: 4, unitFare: 300, notes: '' },
  ]))

  it('minUnit 未満は 0 を返す', () => {
    expect(charge.calculator('delivery-count')?.calculate(3)).toBe(0)
  })

  it('minUnit ちょうどで課金が始まる', () => {
    // (4 - 4 + 1) * 300 = 300
    expect(charge.calculator('delivery-count')?.calculate(4)).toBe(300)
  })

  it('minUnit を超えると加算される', () => {
    // (6 - 4 + 1) * 300 = 900
    expect(charge.calculator('delivery-count')?.calculate(6)).toBe(900)
  })
})

// ---------------------------------------------------------------------------
// ChargeUnitMinutes
// ---------------------------------------------------------------------------

describe('ChargeUnitMinutes', () => {
  const charge = new Charge(makeItems([
    { code: 'waiting-time', label: '待機時間', unit: 'minutes', taxable: true, baseUnit: 15, minUnit: 2, unitFare: 500, notes: '' },
  ]))

  it('baseUnit 未満は切り捨てで 0 単位 → 0 を返す', () => {
    expect(charge.calculator('waiting-time')?.calculate(14)).toBe(0)
  })

  it('minUnit 未満の単位数は 0 を返す', () => {
    // 15分 → 1単位 < minUnit(2) → 0
    expect(charge.calculator('waiting-time')?.calculate(15)).toBe(0)
  })

  it('minUnit 以上で課金される', () => {
    // 30分 → 2単位 = minUnit → 2 * 500 = 1000
    expect(charge.calculator('waiting-time')?.calculate(30)).toBe(1000)
  })

  it('baseUnit 単位で切り捨てられる', () => {
    // 44分 → trunc(44/15) = 2単位 → 2 * 500 = 1000
    expect(charge.calculator('waiting-time')?.calculate(44)).toBe(1000)
  })
})

// ---------------------------------------------------------------------------
// ChargeUnitYen
// ---------------------------------------------------------------------------

describe('ChargeUnitYen', () => {
  const charge = new Charge(makeItems([
    { code: 'highway-fee', label: '高速料金', unit: 'yen', taxable: false, baseUnit: 1, minUnit: 1, unitFare: 1, notes: '' },
  ]))

  it('入力値をそのまま返す', () => {
    expect(charge.calculator('highway-fee')?.calculate(1500)).toBe(1500)
  })

  it('0 は 0 を返す', () => {
    expect(charge.calculator('highway-fee')?.calculate(0)).toBe(0)
  })
})
