import type { Resource } from '@azure/cosmos'
import type { HttpRequest, HttpResponseInit, InvocationContext } from '@azure/functions'
import type { z } from 'zod'
import { getDatabase } from '../lib/cosmos'
import { createItemBodySchema, createItemParamsSchema } from '../schemas'
import { Pipeline } from '../shared'
import type { CosmosItem } from '../shared'
import { type EnrichedRequest, type EnrichedRequestBody, toResponse, validateBody, validateParams } from './middlewares'

/**
 * アイテム作成。
 * @param request - HTTP リクエスト
 * @param context - 関数の実行コンテキスト
 * @returns 作成されたアイテムを含む JSON レスポンス
 */
export async function createItem(
  request: HttpRequest,
  context: InvocationContext,
): Promise<HttpResponseInit> {
  const container = request.params.container
  context.log(`create item: container=${container}`)

  return Pipeline.send(request)
    .pipe(validateParams, createItemParamsSchema)
    .pipe(validateBody, createItemBodySchema)
    .pipe(toResponse)
    .then(async (req) => {
      const { container } = (req as EnrichedRequest<z.infer<typeof createItemParamsSchema>>).safeData
      const body = (req as EnrichedRequestBody<ReturnType<typeof createItemBodySchema>>).safeBody
      const { resource } = await getDatabase()
        .container(container)
        .items
        .create<CosmosItem & Resource>(body as unknown as CosmosItem & Resource)
      if (!resource) throw new Error('Failed to create item')
      return resource
    })
}
