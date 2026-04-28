import type { TariffsItem } from '@shisamo/shared'

export class Tariff {
  constructor(private readonly item: TariffsItem) {}

  /**
   * @param distance
   * @returns
   */
  calculate(distance: number): number | null {
    if (distance <= 0) return null
    const range = this.item.ranges.find(r => distance >= r.minKm && distance <= r.maxKm)
    if (!range) return null
    const units = Math.ceil((distance - range.minKm) / range.unitKm)
    return range.baseFare + units * range.unitFare
  }
}
