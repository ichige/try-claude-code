import type { CosmosItem } from './cosmos'

/**
 * Forwarders(地点) コンテナのアイテム。
 */
export interface ForwardersItem extends CosmosItem {
  /** 都道府県 */
  prefecture: string
  /** 市区町村 */
  city: string
  /** 備考 */
  notes: string
}
