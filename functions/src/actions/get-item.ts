import type { Resource } from '@azure/cosmos'
import type { HttpRequest, HttpResponseInit, InvocationContext } from '@azure/functions'
import { NotFoundError } from '../errors'
import { getDatabase } from '../lib/cosmos'
import { Passable } from '../lib/passable'
import { getItemParamsSchema } from '../schemas'
import { Pipeline } from '../shared/index.node'
import type { CosmosItem } from '../shared/index.node'
import { toResponse, validateParams } from './middlewares'

/**
 * アイテム1件取得。
 * @param request - HTTP リクエスト
 * @param context - 関数の実行コンテキスト
 * @returns アイテムを含む JSON レスポンス
 */
export async function getItem(
  request: HttpRequest,
  context: InvocationContext,
): Promise<HttpResponseInit> {
  const { container, id } = request.params
  context.log(`get item: container=${container}, id=${id}`)

  const passable = await Pipeline.send(new Passable(request))
    .pipe(validateParams(getItemParamsSchema))
    .pipe(toResponse)
    .then(async (p) => {
      const { container, id, pk } = p.params
      const { resource } = await getDatabase()
        .container(container)
        .item(id, pk)
        .read<CosmosItem & Resource>()
      if (!resource) throw new NotFoundError()
      return resource
    })

  return passable.response
}
