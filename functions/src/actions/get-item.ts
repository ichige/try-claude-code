import type { HttpRequest, HttpResponseInit, InvocationContext } from '@azure/functions'
import { getDatabase } from '../lib/cosmos'
import { Pipeline } from '../shared'
import type { CosmosItem } from '../types/cosmos'
import { notFound, toResponse } from './middlewares'

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
    .pipe(notFound)
    .pipe(toResponse)
    .then(async (req) => {
      const { resource } = await getDatabase()
        .container(req.params.container)
        .item(req.params.id)
        .read<CosmosItem>()
      return resource ?? null
    })
}
