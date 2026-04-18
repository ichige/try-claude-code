import type { Resource } from '@azure/cosmos'
import type { HttpRequest, HttpResponseInit, InvocationContext } from '@azure/functions'
import { getDatabase } from '../lib/cosmos'
import { Passable } from '../lib/passable'
import { createItemBodySchema, createItemParamsSchema } from '../schemas'
import { Pipeline } from '../shared'
import type { CosmosItem } from '../shared'
import { toResponse2, validateBody, validateParams } from './middlewares'

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

  const passable = await Pipeline.send(new Passable(request))
    .pipe(validateParams(createItemParamsSchema))
    .pipe(validateBody(createItemBodySchema))
    .pipe(toResponse2)
    .then(async (p) => {
      const { container } = p.params
      const { resource } = await getDatabase()
        .container(container)
        .items.create<CosmosItem & Resource>(p.body as CosmosItem & Resource)
      return resource!
    })

  return passable.response
}
