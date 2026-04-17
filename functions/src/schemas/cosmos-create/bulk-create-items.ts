import { BulkOperationType } from '@azure/cosmos'
import type { HttpRequest } from '@azure/functions'
import { z } from 'zod'
import { containerSchema } from '../container'
import { createItemBodySchema } from './create-item'

/**
 * bulkCreateItems エンドポイントのパスパラメータスキーマ。
 */
export const bulkCreateItemsParamsSchema = z.object({
  container: containerSchema,
})

/**
 * bulkCreateItems エンドポイントのリクエストボディスキーマファクトリ。
 * createItemBodySchema をベースに operationType を注入し、
 * SDK が要求する resourceBody / partitionKey 形式に変換する。
 * @param req - validateParams 通過済みの HTTP リクエスト
 * @returns Zod スキーマ
 */
export const bulkCreateItemsBodySchema = (req: HttpRequest) =>
  z.array(
    createItemBodySchema(req).transform((item) => ({
      operationType: BulkOperationType.Create,
      resourceBody: item,
      partitionKey: item.pk as string,
    })),
  )
