import type { Resource } from '@azure/cosmos'
import type { HttpRequest, HttpResponseInit, InvocationContext } from '@azure/functions'
import type { z } from 'zod'
import { getDatabase } from '../lib/cosmos'
import { listItemsParamsSchema } from '../schemas'
import { Pipeline } from '../shared'
import type { CosmosItem } from '../shared'
import { type EnrichedRequest, toResponses, validateParams } from './middlewares'

/**
 * アイテム一覧取得。
 * @param request - HTTP リクエスト
 * @param context - 関数の実行コンテキスト
 * @returns アイテム一覧を含む JSON レスポンス
 */
export async function listItems(
  request: HttpRequest,
  context: InvocationContext,
): Promise<HttpResponseInit> {
  const { container } = request.params
  context.log(`list items: container=${container}`)

  return Pipeline.send(request)
    .pipe(validateParams, listItemsParamsSchema)
    .pipe(toResponses)
    .then(async (req) => {
      const { container, pk } = (req as EnrichedRequest<z.infer<typeof listItemsParamsSchema>>).safeData
      const { resources } = await getDatabase()
        .container(container)
        .items.readAll<CosmosItem & Resource>({ partitionKey: pk })
        .fetchAll()
      return resources ?? []
    })
}
