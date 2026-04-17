import { itemParamsSchema } from '../item-params'

/**
 * getItem エンドポイントのパスパラメータスキーマ。
 * pk は省略時にコンテナ名から導出する。
 */
export const getItemParamsSchema = itemParamsSchema
