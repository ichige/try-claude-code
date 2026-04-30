import type { ChargeItem, ChargeItems } from '@shisamo/shared'

interface ChargeCalculator {
  calculate(value: number): number
}

class ChargeUnitCount implements ChargeCalculator {
  constructor(private readonly item: ChargeItem) {}

  /**
   * @param value - 配送件数
   * @returns 課金額（minUnit 未満は 0）
   */
  calculate(value: number): number {
    if (value < this.item.minUnit) return 0
    return (value - this.item.minUnit + 1) * this.item.unitFare
  }
}

class ChargeUnitMinutes implements ChargeCalculator {
  constructor(private readonly item: ChargeItem) {}

  /**
   * @param value - 経過分数
   * @returns 課金額（baseUnit 単位に切り捨て、minUnit 未満は 0）
   */
  calculate(value: number): number {
    const units = Math.trunc(value / this.item.baseUnit)
    if (units < this.item.minUnit) return 0
    return units * this.item.unitFare
  }
}

class ChargeUnitYen implements ChargeCalculator {
  /**
   * @param value - 金額（実費）
   * @returns そのまま返す
   */
  calculate(value: number): number {
    return value
  }
}

export class Charge {
  constructor(private readonly chargeItems: ChargeItems) {}

  /**
   * @param code - 計算対象の種別コード
   * @returns 対応する Calculator。コードが存在しない場合は null
   */
  calculator(code: string): ChargeCalculator | null {
    const item = this.chargeItems.items.find(i => i.code === code)
    if (!item) return null
    switch (item.unit) {
      case 'count':   return new ChargeUnitCount(item)
      case 'minutes': return new ChargeUnitMinutes(item)
      case 'yen':     return new ChargeUnitYen()
    }
  }
}
