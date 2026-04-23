import type { CosmosItem } from './cosmos'

/**
 * Carriers コンテナのアイテム。
 */
export interface CarriersItem extends CosmosItem {
  /** 会社名 */
  companyName: string
  /** 管理コード */
  companyCode: string
  /** インボイス番号 */
  invoiceNumber: string
  /** LINEログイン連携フラグ */
  lineConnected: boolean
  /** 郵便番号 */
  postalCode: string
  /** 都道府県 */
  prefecture: string
  /** 市区町村・番地 */
  cityStreet: string
  /** 建物名・部屋番号 */
  building: string
  /** 電話番号 */
  phone: string
  /** メールアドレス */
  email: string
  /** Webサイト */
  website: string
  /** 備考 */
  notes: string
}
