import type { OperationInput } from '@azure/cosmos'
import type { HttpRequest, HttpResponseInit, InvocationContext } from '@azure/functions'
import type { z } from 'zod'
import { getDatabase } from '../lib/cosmos'
import { bulkReplaceItemsBodySchema, bulkReplaceItemsParamsSchema } from '../schemas'
import { Pipeline } from '../shared'
import { type EnrichedRequest, type EnrichedRequestBody, toBulkResponse, validateBody, validateParams } from './middlewares'

/**
 * アイテムバルク全置換。
 * @param request - HTTP リクエスト
 * @param context - 関数の実行コンテキスト
 * @returns 各アイテムの置換結果を含む JSON レスポンス
 */
export async function bulkReplaceItems(
  request: HttpRequest,
  context: InvocationContext,
): Promise<HttpResponseInit> {
  const { container } = request.params
  context.log(`bulk replace items: container=${container}`)

  return Pipeline.send(request)
    .pipe(validateParams, bulkReplaceItemsParamsSchema)
    .pipe(validateBody, bulkReplaceItemsBodySchema)
    .pipe(toBulkResponse)
    .then(async (req) => {
      const { container } = (req as EnrichedRequest<z.infer<typeof bulkReplaceItemsParamsSchema>>).safeData
      const operations = (req as EnrichedRequestBody<OperationInput[]>).safeBody
      return getDatabase().container(container).items.executeBulkOperations(operations)
    })
}
