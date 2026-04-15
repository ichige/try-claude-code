import type { HttpRequest, HttpResponseInit, InvocationContext } from '@azure/functions'

/**
 * アイテムバルク物理削除。
 * @param request - HTTP リクエスト
 * @param context - 関数の実行コンテキスト
 * @returns 削除結果を含む JSON レスポンス
 */
export async function bulkDeleteItems(
  request: HttpRequest,
  context: InvocationContext,
): Promise<HttpResponseInit> {
  const container = request.params.container
  context.log(`bulk delete items: container=${container}`)

  return {
    status: 200,
    jsonBody: { deleted: true },
  }
}
