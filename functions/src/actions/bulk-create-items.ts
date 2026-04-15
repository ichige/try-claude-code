import type { HttpRequest, HttpResponseInit, InvocationContext } from '@azure/functions'

/**
 * アイテムバルク作成。
 * @param request - HTTP リクエスト
 * @param context - 関数の実行コンテキスト
 * @returns 作成されたアイテム一覧を含む JSON レスポンス
 */
export async function bulkCreateItems(
  request: HttpRequest,
  context: InvocationContext,
): Promise<HttpResponseInit> {
  const container = request.params.container
  context.log(`bulk create items: container=${container}`)

  return {
    status: 201,
    jsonBody: { items: [] },
  }
}
