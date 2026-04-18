import type { OperationInput } from '@azure/cosmos'
import type { HttpRequest, HttpResponseInit, InvocationContext } from '@azure/functions'
import { getDatabase } from '../lib/cosmos'
import { Passable } from '../lib/passable'
import { bulkCreateItemsBodySchema, bulkCreateItemsParamsSchema } from '../schemas'
import { Pipeline } from '../shared'
import { toBulkResponse2, validateBody, validateParams } from './middlewares'

/**
 * アイテムバルク作成。
 * @param request - HTTP リクエスト
 * @param context - 関数の実行コンテキスト
 * @returns 各アイテムの作成結果を含む JSON レスポンス
 */
export async function bulkCreateItems(
  request: HttpRequest,
  context: InvocationContext,
): Promise<HttpResponseInit> {
  const { container } = request.params
  context.log(`bulk create items: container=${container}`)

  const passable = await Pipeline.send(new Passable(request))
    .pipe(validateParams(bulkCreateItemsParamsSchema))
    .pipe(validateBody(bulkCreateItemsBodySchema))
    .pipe(toBulkResponse2)
    .then(async (p) => {
      const { container } = p.params
      return getDatabase()
        .container(container)
        .items.executeBulkOperations(p.body as OperationInput[])
    })

  return passable.response
}
