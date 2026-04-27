import type { CosmosItem } from './cosmos'

/**
 * 運賃条件データ
 */
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
  /** 運賃表の名前 */
  name: string
  /** 有効化フラグ。一度有効化したら変更できず、ReadOnly となる。 */
  enabled: boolean
  /** 無効化フラグ。無効になると利用できなくなるが、いつでも解除できる。 */
  disabled: boolean
  /** 距離別運賃条件 */
  ranges: TariffRange[]
  /** 備考欄 */
  notes: string
}
