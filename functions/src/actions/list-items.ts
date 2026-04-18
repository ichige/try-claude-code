import type { Resource } from '@azure/cosmos'
import type { HttpRequest, HttpResponseInit, InvocationContext } from '@azure/functions'
import { getDatabase } from '../lib/cosmos'
import { Passable } from '../lib/passable'
import { listItemsParamsSchema } from '../schemas'
import { Pipeline } from '../shared'
import type { CosmosItem } from '../shared'
import { toResponses2, validateParams } from './middlewares'

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

  const passable = await Pipeline.send(new Passable(request))
    .pipe(validateParams(listItemsParamsSchema))
    .pipe(toResponses2)
    .then(async (p) => {
      const { container, pk } = p.params
      const { resources } = await getDatabase()
        .container(container)
        .items.readAll<CosmosItem & Resource>({ partitionKey: pk })
        .fetchAll()
      return resources ?? []
    })

  return passable.response
}
