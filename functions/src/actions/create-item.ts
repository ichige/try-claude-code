import type { HttpRequest, HttpResponseInit, InvocationContext } from '@azure/functions'

/**
 * アイテム作成。
 * @param request - HTTP リクエスト
 * @param context - 関数の実行コンテキスト
 * @returns 作成されたアイテムを含む JSON レスポンス
 */
export async function createItem(
  request: HttpRequest,
  context: InvocationContext,
): Promise<HttpResponseInit> {
  const container = request.params.container
  context.log(`create item: container=${container}`)

  return {
    status: 201,
    jsonBody: { item: null },
  }
}
