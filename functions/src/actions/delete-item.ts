import { ErrorResponse } from '@azure/cosmos'
import type { HttpRequest, HttpResponseInit, InvocationContext } from '@azure/functions'
import { NotFoundError } from '../errors'
import { getDatabase } from '../lib/cosmos'
import { Passable } from '../lib/passable'
import { deleteItemParamsSchema } from '../schemas'
import { Pipeline } from '../shared'
import { validateParams } from './middlewares'

/**
 * アイテム物理削除。
 * @param request - HTTP リクエスト
 * @param context - 関数の実行コンテキスト
 * @returns 削除結果を含む JSON レスポンス
 */
export async function deleteItem(
  request: HttpRequest,
  context: InvocationContext,
): Promise<HttpResponseInit> {
  const { container, id } = request.params
  context.log(`delete item: container=${container}, id=${id}`)

  const passable = await Pipeline.send(new Passable(request))
    .pipe(validateParams(deleteItemParamsSchema))
    .then(async (p) => {
      const { container, id, pk } = p.params
      try {
        await getDatabase().container(container).item(id, pk).delete()
      } catch (e) {
        if (e instanceof ErrorResponse && Number(e.code) === 404) throw new NotFoundError()
        throw e
      }
      p.response = { status: 204 }
      return p
    })

  return passable.response
}
