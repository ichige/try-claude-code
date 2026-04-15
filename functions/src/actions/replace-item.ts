import type { HttpRequest, HttpResponseInit, InvocationContext } from '@azure/functions'

/**
 * アイテム全置換。
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

  return {
    status: 200,
    jsonBody: { item: null },
  }
}
