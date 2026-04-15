import type { HttpRequest, HttpResponseInit, InvocationContext } from '@azure/functions'

/**
 * アイテム物理削除。
 * @param request - HTTP リクエスト
 * @param context - 関数の実行コンテキスト
 * @returns 削除結果を含む JSON レスポンス
 */
export async function deleteItem(
  request: HttpRequest,
  context: InvocationContext,
): Promise<HttpResponseInit> {
  const { container, id } = request.params
  context.log(`delete item: container=${container}, id=${id}`)

  return {
    status: 200,
    jsonBody: { deleted: true },
  }
}
