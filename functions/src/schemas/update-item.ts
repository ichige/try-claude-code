import { z } from 'zod'
import { itemParamsSchema } from './item-params'

/**
 * updateItem エンドポイントのパスパラメータスキーマ。
 * pk は省略時にコンテナ名から導出する。
 */
export const updateItemParamsSchema = itemParamsSchema

/**
 * updatedAt / isDeleted / deletedAt を解決する共通変換関数。
 * bulkUpdateItemSchema でも使用する。
 * @param data - 変換前のデータ
 * @returns 変換後のデータ
 */
export function applyUpdateFields(
  data: { updatedAt?: unknown; isDeleted?: boolean; [key: string]: unknown },
): Record<string, unknown> {
  const { updatedAt: _, isDeleted, ...rest } = data
  const result: Record<string, unknown> = { ...rest, updatedAt: new Date().toISOString() }
  if (isDeleted !== undefined) {
    result.isDeleted = isDeleted
    result.deletedAt = isDeleted ? new Date().toISOString() : null
  }
  return result
}

/**
 * updateItem エンドポイントのリクエストボディスキーマ。
 * _etag は必須（楽観的同時実行制御）。
 * isDeleted は省略可能な boolean。true の場合は deletedAt を現在時刻、false の場合は null に設定する。
 * updatedAt はリクエスト値を無視してサーバ側で現在時刻に上書きする。
 * その他のフィールドは任意の値を受け付ける。
 * _etag はアクションで accessCondition に使用するためそのまま出力に残す。
 */
export const updateItemBodySchema = z
  .object({
    _etag: z.string(),
    isDeleted: z.boolean().optional(),
  })
  .catchall(z.unknown())
  .transform(applyUpdateFields)
