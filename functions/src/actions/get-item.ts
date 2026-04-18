import type { Resource } from '@azure/cosmos'
import type { HttpRequest, HttpResponseInit, InvocationContext } from '@azure/functions'
import { NotFoundError } from '../errors'
import { getDatabase } from '../lib/cosmos'
import { Passable } from '../lib/passable'
import { getItemParamsSchema } from '../schemas'
import { Pipeline } from '../shared'
import type { CosmosItem } from '../shared'
import { validateParams2 } from './middlewares'

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
    .pipe(validateParams2(getItemParamsSchema))
    .then(async (p) => {
      const { container, id, pk } = p.params
      const { resource } = await getDatabase()
        .container(container)
        .item(id, pk)
        .read<CosmosItem & Resource>()
      if (!resource) throw new NotFoundError()
      const { _rid, _ts, _self, _attachments, ...item } = resource
      p.response = { status: 200, jsonBody: { item } }
      return p
    })

  return passable.response
}
