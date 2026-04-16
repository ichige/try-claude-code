import { z } from 'zod'

/**
 * 有効なコンテナ名の列挙。
 * 新しいコンテナを追加する場合はここに追記する。
 */
export const containerSchema = z.enum(['Consignees', 'Carriers', 'Forwarders', 'Consignors'])
