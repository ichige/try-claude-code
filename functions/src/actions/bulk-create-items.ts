import type { OperationInput } from '@azure/cosmos'
import type { HttpRequest, HttpResponseInit, InvocationContext } from '@azure/functions'
import type { z } from 'zod'
import { getDatabase } from '../lib/cosmos'
import { bulkCreateItemsBodySchema, bulkCreateItemsParamsSchema } from '../schemas'
import { Pipeline } from '../shared'
import { type EnrichedRequest, type EnrichedRequestBody, toBulkResponse, validateBody, validateParams } from './middlewares'

/**
 * アイテムバルク作成。
 * @param request - HTTP リクエスト
 * @param context - 関数の実行コンテキスト
 * @returns 各アイテムの作成結果を含む JSON レスポンス
 */
export async function bulkCreateItems(
  request: HttpRequest,
  context: InvocationContext,
): Promise<HttpResponseInit> {
  const { container } = request.params
  context.log(`bulk create items: container=${container}`)

  return Pipeline.send(request)
    .pipe(validateParams, bulkCreateItemsParamsSchema)
    .pipe(validateBody, bulkCreateItemsBodySchema)
    .pipe(toBulkResponse)
    .then(async (req) => {
      const { container } = (req as EnrichedRequest<z.infer<typeof bulkCreateItemsParamsSchema>>).safeData
      const operations = (req as EnrichedRequestBody<OperationInput[]>).safeBody
      return getDatabase().container(container).items.executeBulkOperations(operations)
    })
}
