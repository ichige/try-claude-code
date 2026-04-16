import type { OperationInput } from '@azure/cosmos'
import type { HttpRequest, HttpResponseInit, InvocationContext } from '@azure/functions'
import type { z } from 'zod'
import { getDatabase } from '../lib/cosmos'
import { bulkDeleteItemsBodySchema, bulkDeleteItemsParamsSchema } from '../schemas'
import { Pipeline } from '../shared'
import { type EnrichedRequest, type EnrichedRequestBody, toBulkResponse, validateBody, validateParams } from './middlewares'

/**
 * アイテムバルク物理削除。
 * @param request - HTTP リクエスト
 * @param context - 関数の実行コンテキスト
 * @returns 各アイテムの削除結果を含む JSON レスポンス
 */
export async function bulkDeleteItems(
  request: HttpRequest,
  context: InvocationContext,
): Promise<HttpResponseInit> {
  const { container } = request.params
  context.log(`bulk delete items: container=${container}`)

  return Pipeline.send(request)
    .pipe(validateParams, bulkDeleteItemsParamsSchema)
    .pipe(validateBody, bulkDeleteItemsBodySchema)
    .pipe(toBulkResponse)
    .then(async (req) => {
      const { container } = (req as EnrichedRequest<z.infer<typeof bulkDeleteItemsParamsSchema>>).safeData
      const operations = (req as EnrichedRequestBody<OperationInput[]>).safeBody
      return getDatabase().container(container).items.executeBulkOperations(operations)
    })
}
