import type { HttpRequest, HttpResponseInit, InvocationContext } from '@azure/functions'

/**
 * アイテムバルク全置換。
 * @param request - HTTP リクエスト
 * @param context - 関数の実行コンテキスト
 * @returns 置換されたアイテム一覧を含む JSON レスポンス
 */
export async function bulkReplaceItems(
  request: HttpRequest,
  context: InvocationContext,
): Promise<HttpResponseInit> {
  const container = request.params.container
  context.log(`bulk replace items: container=${container}`)

  return {
    status: 200,
    jsonBody: { items: [] },
  }
}
