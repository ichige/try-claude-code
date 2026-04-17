import { BulkOperationType } from '@azure/cosmos'
import type { HttpRequest } from '@azure/functions'
import { z } from 'zod'
import { containerSchema } from '../container'
import { createItemSchema } from './create-item'

/**
 * bulkCreateItems エンドポイントのパスパラメータスキーマ。
 */
export const bulkCreateItemsParamsSchema = z.object({
  container: containerSchema,
})

/**
 * バルク作成の各アイテムスキーマファクトリ。
 * createItemSchema をベースに operationType を注入し、
 * SDK が要求する resourceBody / partitionKey 形式に変換する。
 * @param container - コンテナ名（safeData.container から取り出した値）
 * @returns Zod スキーマ
 */
export const bulkCreateItemSchema = (container: string) =>
  createItemSchema(container).transform((item) => ({
    operationType: BulkOperationType.Create,
    resourceBody: item,
    partitionKey: item.pk as string,
  }))

/**
 * bulkCreateItems エンドポイントのリクエストボディスキーマファクトリ。
 * validateBody ミドルウェアに直接渡せるよう HttpRequest を受け取り、
 * safeData.container からコンテナ名を取り出してスキーマを生成する。
 * @param req - validateParams 通過済みの HTTP リクエスト（safeData.container が必須）
 * @returns Zod スキーマ
 */
export const bulkCreateItemsBodySchema = (req: HttpRequest) => {
  const { container } = (req as HttpRequest & { safeData: { container: string } }).safeData
  return z.array(bulkCreateItemSchema(container))
}
