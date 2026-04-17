import { ErrorResponse, PatchOperationType } from '@azure/cosmos'
import type { Resource } from '@azure/cosmos'
import type { HttpRequest, HttpResponseInit, InvocationContext } from '@azure/functions'
import type { z } from 'zod'
import { NotFoundError, PreconditionFailedError } from '../errors'
import { getDatabase } from '../lib/cosmos'
import { updateItemBodySchema, updateItemParamsSchema } from '../schemas'
import { Pipeline } from '../shared'
import type { CosmosItem } from '../shared'
import { type EnrichedRequest, type EnrichedRequestBody, toResponse, validateBody, validateParams } from './middlewares'

/**
 * アイテム部分更新。
 * _etag を accessCondition に指定し、楽観的同時実行制御を行う。
 * @param request - HTTP リクエスト
 * @param context - 関数の実行コンテキスト
 * @returns 更新されたアイテムを含む JSON レスポンス
 */
export async function updateItem(
  request: HttpRequest,
  context: InvocationContext,
): Promise<HttpResponseInit> {
  const { container, id } = request.params
  context.log(`update item: container=${container}, id=${id}`)

  return Pipeline.send(request)
    .pipe(validateParams, updateItemParamsSchema)
    .pipe(validateBody, updateItemBodySchema)
    .pipe(toResponse)
    .then(async (req) => {
      const { container, id, pk } = (req as EnrichedRequest<z.infer<typeof updateItemParamsSchema>>).safeData
      const { _etag, ...fields } = (req as EnrichedRequestBody<z.infer<typeof updateItemBodySchema>>).safeBody
      const operations = Object.entries(fields).map(([key, value]) => ({
        op: PatchOperationType.set,
        path: `/${key}`,
        value,
      }))
      try {
        const { resource } = await getDatabase()
          .container(container)
          .item(id, pk)
          .patch<CosmosItem & Resource>(
            operations,
            { accessCondition: { type: 'IfMatch', condition: String(_etag) } },
          )
        return resource!
      } catch (e) {
        if (e instanceof ErrorResponse) {
          if (Number(e.code) === 404) throw new NotFoundError()
          if (Number(e.code) === 412) throw new PreconditionFailedError()
        }
        throw e
      }
    })
}
