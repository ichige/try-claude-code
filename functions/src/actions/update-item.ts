import type { HttpRequest, HttpResponseInit, InvocationContext } from '@azure/functions';

/**
 * アイテム更新。
 * @param request - HTTP リクエスト
 * @param context - 関数の実行コンテキスト
 * @returns 更新されたアイテムを含む JSON レスポンス
 */
export async function updateItem(
  request: HttpRequest,
  context: InvocationContext,
): Promise<HttpResponseInit> {
  const { container, id } = request.params;
  context.log(`update item: container=${container}, id=${id}`);

  return {
    status: 200,
    jsonBody: { item: null },
  };
}
