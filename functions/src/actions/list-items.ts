import type { HttpRequest, HttpResponseInit, InvocationContext } from '@azure/functions'
import type { CosmosItem } from '../types/cosmos'

/**
 * アイテム一覧取得。
 * @param request - HTTP リクエスト
 * @param context - 関数の実行コンテキスト
 * @returns アイテム一覧を含む JSON レスポンス
 */
export async function listItems(
  request: HttpRequest,
  context: InvocationContext,
): Promise<HttpResponseInit> {
  const container = request.params.container
  context.log(`list items: container=${container}`)

  const items: CosmosItem[] = []

  return {
    status: 200,
    jsonBody: { items },
  }
}
