import { ErrorResponse } from '@azure/cosmos'
import type { Resource } from '@azure/cosmos'
import type { HttpRequest, HttpResponseInit, InvocationContext } from '@azure/functions'
import { NotFoundError, PreconditionFailedError } from '../errors'
import { getDatabase } from '../lib/cosmos'
import { Passable } from '../lib/passable'
import { replaceItemBodySchema, replaceItemParamsSchema } from '../schemas'
import { Pipeline } from '../shared'
import type { CosmosItem } from '../shared'
import { toResponse, validateBody, validateParams } from './middlewares'

/**
 * アイテム全置換。
 * _etag を accessCondition に指定し、楽観的同時実行制御を行う。
 * @param request - HTTP リクエスト
 * @param context - 関数の実行コンテキスト
 * @returns 置換されたアイテムを含む JSON レスポンス
 */
export async function replaceItem(
  request: HttpRequest,
  context: InvocationContext,
): Promise<HttpResponseInit> {
  const { container, id } = request.params
  context.log(`replace item: container=${container}, id=${id}`)

  const passable = await Pipeline.send(new Passable(request))
    .pipe(validateParams(replaceItemParamsSchema))
    .pipe(validateBody(replaceItemBodySchema))
    .pipe(toResponse)
    .then(async (p) => {
      const { container, id, pk } = p.params
      const { _etag, ...body } = p.body as Record<string, unknown>
      try {
        const { resource } = await getDatabase()
          .container(container)
          .item(id, pk)
          .replace<CosmosItem & Resource>(
            body as unknown as CosmosItem & Resource,
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

  return passable.response
}
