import { z } from 'zod'

/**
 * 有効なコンテナ名の列挙。
 * 新しいコンテナを追加する場合はここに追記する。
 */
export const containerSchema = z.enum([
  'Consignees', // 配送先
  'Carriers',  // 配送業者
  'Forwarders', // 地点
  'Consignors', // 取引先
  'Tariffs', // 運賃表
  'Charges', // 付帯料金
  'Shipments', // 取引データ
])
