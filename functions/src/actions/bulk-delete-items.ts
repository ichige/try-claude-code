import type { OperationInput } from '@azure/cosmos'
import type { HttpRequest, HttpResponseInit, InvocationContext } from '@azure/functions'
import { getDatabase } from '../lib/cosmos'
import { Passable } from '../lib/passable'
import { bulkDeleteItemsBodySchema, bulkDeleteItemsParamsSchema } from '../schemas'
import { Pipeline } from '../shared'
import { toBulkResponse2, validateBody, validateParams } from './middlewares'

/**
 * アイテムバルク物理削除。
 * @param request - HTTP リクエスト
 * @param context - 関数の実行コンテキスト
 * @returns 各アイテムの削除結果を含む JSON レスポンス
 */
export async function bulkDeleteItems(
  request: HttpRequest,
  context: InvocationContext,
): Promise<HttpResponseInit> {
  const { container } = request.params
  context.log(`bulk delete items: container=${container}`)

  const passable = await Pipeline.send(new Passable(request))
    .pipe(validateParams(bulkDeleteItemsParamsSchema))
    .pipe(validateBody(bulkDeleteItemsBodySchema))
    .pipe(toBulkResponse2)
    .then(async (p) => {
      const { container } = p.params
      return getDatabase()
        .container(container)
        .items.executeBulkOperations(p.body as OperationInput[])
    })

  return passable.response
}
