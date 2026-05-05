import type { CosmosItem } from './cosmos'
import type { ChargeCode } from './charges'

/**
 * 取引のステータス
 * - new: STEP1 作成直後。物理削除可能。
 * - assigned: STEP2 で配送業者を選定済み。物理削除・編集可能。
 * - submitted: STEP3 で実績入力完了。物理削除・編集可能。
 * - completed: STEP4 で確認完了。物理削除・編集不可。
 * - reverted: STEP4 から強制差し戻し。物理削除・編集可能。
 */
export type ShipmentStatus = 'new' | 'assigned' | 'submitted' | 'completed' | 'reverted'

/**
 * 配送内訳のコード
 */
export type ShipmentBreakdownCode = 'distance' | ChargeCode

/**
 * 配送内訳の型
 */
export interface ShipmentBreakdown {
  code: string
  quantity: number
}

/**
 * 取引先への請求書データ
 */
export interface ShipmentInvoice {
  [key: string]: unknown
}

/**
 * 取引先への明細書データ
 */
export interface ShipmentInvoiceDetails {
  [key: string]: unknown
}

/**
 * Shipments(配送依頼取引) コンテナのアイテム。
 */
export interface ShipmentsItem extends CosmosItem {
  /** ステータス */
  status: ShipmentStatus
  /** 取引先ID(荷主) */
  consignorId: string
  /** 配送日(YYYY-MM-DD) */
  deliveryDate: string
  /** 発送地名(主に市区町村名) */
  origin: string
  /** 積地住所 */
  originAddress: string
  /** 納品先 */
  destination: string
  /** 納品先住所 */
  destinationAddress: string
  /** 配送業者ID */
  carrierId: string | null
  /** 内訳 */
  breakdown: ShipmentBreakdown[]
  /** 請求書データ */
  invoice: ShipmentInvoice | null
  /** 請求書明細データ */
  details: ShipmentInvoiceDetails | null
  /** 備考 */
  notes: string
}
