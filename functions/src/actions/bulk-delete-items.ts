import type { HttpRequest, HttpResponseInit, InvocationContext } from '@azure/functions'
import type { z } from 'zod'
import { getDatabase } from '../lib/cosmos'
import { bulkDeleteItemsBodySchema, bulkDeleteItemsParamsSchema } from '../schemas'
import { Pipeline } from '../shared'
import { type EnrichedRequest, type EnrichedRequestBody, validateBody, validateParams } from './middlewares'

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
    .then(async (req) => {
      const { container } = (req as EnrichedRequest<z.infer<typeof bulkDeleteItemsParamsSchema>>).safeData
      const operations = (req as EnrichedRequestBody<z.infer<typeof bulkDeleteItemsBodySchema>>).safeBody
      const bulkResults = await getDatabase().container(container).items.executeBulkOperations(operations)

      return {
        status: 200,
        jsonBody: {
          results: bulkResults.map((r) => ({
            id: (r.operationInput as { id: string }).id,
            deleted: r.response?.statusCode === 204,
            statusCode: r.response?.statusCode ?? r.error?.code,
          })),
        },
      }
    })
}
