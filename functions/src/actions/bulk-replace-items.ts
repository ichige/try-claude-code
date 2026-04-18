import type { OperationInput } from '@azure/cosmos'
import type { HttpRequest, HttpResponseInit, InvocationContext } from '@azure/functions'
import { getDatabase } from '../lib/cosmos'
import { Passable } from '../lib/passable'
import { bulkReplaceItemsBodySchema, bulkReplaceItemsParamsSchema } from '../schemas'
import { Pipeline } from '../shared'
import { toBulkResponse, validateBody, validateParams } from './middlewares'

/**
 * アイテムバルク全置換。
 * @param request - HTTP リクエスト
 * @param context - 関数の実行コンテキスト
 * @returns 各アイテムの置換結果を含む JSON レスポンス
 */
export async function bulkReplaceItems(
  request: HttpRequest,
  context: InvocationContext,
): Promise<HttpResponseInit> {
  const { container } = request.params
  context.log(`bulk replace items: container=${container}`)

  const passable = await Pipeline.send(new Passable(request))
    .pipe(validateParams(bulkReplaceItemsParamsSchema))
    .pipe(validateBody(bulkReplaceItemsBodySchema))
    .pipe(toBulkResponse)
    .then(async (p) => {
      const { container } = p.params
      return getDatabase()
        .container(container)
        .items.executeBulkOperations(p.body as OperationInput[])
    })

  return passable.response
}
