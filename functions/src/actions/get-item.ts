import type { HttpRequest, HttpResponseInit, InvocationContext } from '@azure/functions'
import { NotFoundError } from '../errors'
import { getDatabase } from '../lib/cosmos'
import { getItemParamsSchema } from '../schemas'
import { Pipeline } from '../shared'
import type { CosmosItem } from '../types/cosmos'
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

  return Pipeline.send(request)
    .pipe(validateParams, getItemParamsSchema)
    .pipe(toResponse)
    .then(async (req) => {
      const { resource } = await getDatabase()
        .container(req.params.container)
        .item(req.params.id)
        .read<CosmosItem>()
      if (!resource) throw new NotFoundError()
      return resource
    })
}
