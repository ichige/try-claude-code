import type { CosmosItem } from './cosmos'

export interface TariffRange {
  /** 距離下限値 */
  minKm: number
  /** 距離上限値 */
  maxKm: number
  /** 基本料金 */
  baseFare: number
  /** 加算単位 */
  unitKm: number
  /** 加算料金 */
  unitFare: number
}

/**
 * Tariffs(運賃) コンテナのアイテム。
 */
export interface TariffsItem extends CosmosItem {
  ranges: TariffRange[]
}
