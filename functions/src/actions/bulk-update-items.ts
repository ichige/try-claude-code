import type { OperationInput } from '@azure/cosmos'
import type { HttpRequest, HttpResponseInit, InvocationContext } from '@azure/functions'
import { getDatabase } from '../lib/cosmos'
import { Passable } from '../lib/passable'
import { bulkUpdateItemsBodySchema, bulkUpdateItemsParamsSchema } from '../schemas'
import { Pipeline } from '../shared'
import { toBulkResponse2, validateBody, validateParams2 } from './middlewares'

/**
 * アイテムバルク部分更新。
 * @param request - HTTP リクエスト
 * @param context - 関数の実行コンテキスト
 * @returns 各アイテムの更新結果を含む JSON レスポンス
 */
export async function bulkUpdateItems(
  request: HttpRequest,
  context: InvocationContext,
): Promise<HttpResponseInit> {
  const { container } = request.params
  context.log(`bulk update items: container=${container}`)

  const passable = await Pipeline.send(new Passable(request))
    .pipe(validateParams2(bulkUpdateItemsParamsSchema))
    .pipe(validateBody(bulkUpdateItemsBodySchema))
    .pipe(toBulkResponse2)
    .then(async (p) => {
      const { container } = p.params
      return getDatabase()
        .container(container)
        .items.executeBulkOperations(p.body as OperationInput[])
    })

  return passable.response
}
