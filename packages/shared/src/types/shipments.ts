import type { CosmosItem } from './cosmos'
import type { ChargeCode } from './charges'

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
  // TODO
}

/**
 * 取引先への明細書データ
 */
export interface ShipmentInvoiceDetails {
  // TODO
}

/**
 * Shipments(配送依頼取引) コンテナのアイテム。
 */
export interface ShipmentsItem extends CosmosItem {
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
