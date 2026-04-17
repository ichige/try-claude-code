import { itemParamsSchema } from '../item-params'

/**
 * deleteItem エンドポイントのパスパラメータスキーマ。
 * pk は省略時にコンテナ名から導出する。
 */
export const deleteItemParamsSchema = itemParamsSchema
