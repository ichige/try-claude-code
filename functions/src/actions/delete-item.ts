import { ErrorResponse } from '@azure/cosmos'
import type { HttpRequest, HttpResponseInit, InvocationContext } from '@azure/functions'
import type { z } from 'zod'
import { NotFoundError } from '../errors'
import { getDatabase } from '../lib/cosmos'
import { deleteItemParamsSchema } from '../schemas'
import { Pipeline } from '../shared'
import { type EnrichedRequest, validateParams } from './middlewares'

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

  return Pipeline.send(request)
    .pipe(validateParams, deleteItemParamsSchema)
    .then(async (req) => {
      const { container, id, pk } = (req as EnrichedRequest<z.infer<typeof deleteItemParamsSchema>>).safeData
      try {
        await getDatabase().container(container).item(id, pk).delete()
      } catch (e) {
        if (e instanceof ErrorResponse && Number(e.code) === 404) {
          throw new NotFoundError()
        }
        throw e
      }
      return { status: 204 }
    })
}
