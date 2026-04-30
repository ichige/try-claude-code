import type { CosmosItem } from './cosmos'

export type ChargeCode =
  // 配送件数
  'delivery-count' |
  // 高速料金
  'highway-fee' |
  // 待機時間料金
  'waiting-time' |
  // 作業料金
  'working-time' |
  // 駐車料金
  'parking-fee' |
  // キャンセル料金
  'cancel-fee' |
  // 定額料金
  'flat-rate-fee' |
  // その他(税込)
  'other-fee1' |
  // その他(税抜)
  'other-fee2'

export type ChargeUnit =
  // 件数割増
  'count' |
  // 単純な料金
  'yen' |
  // 時間割増(分)
  'minutes'

/**
 * 追加料金データ
 */
export interface ChargeItem {
  /** アイテム種別コード */
  code: ChargeCode | string
  /** 帳票ラベル */
  label: string
  /** 単位 */
  unit: ChargeUnit
  /** 課税対象フラグ */
  taxable: boolean
  /** 基本単位 */
  baseUnit: number
  /** 最低単位 */
  minUnit: number
  /** 加算料金 */
  unitFare: number
  /** 備考欄 */
  notes: string
}

/**
 * Tariffs(運賃) コンテナのアイテム。
 */
export interface ChargeItems extends CosmosItem {
  /** 運賃表の名前 */
  name: string
  /** 有効化フラグ。一度有効化したら変更できず、ReadOnly となる。 */
  enabled: boolean
  /** 有効フラグ。false になると利用できなくなるが、いつでも解除できる。 */
  isActive: boolean
  /** 距離別運賃条件 */
  items: ChargeItem[]
  /** 備考欄 */
  notes: string
}
