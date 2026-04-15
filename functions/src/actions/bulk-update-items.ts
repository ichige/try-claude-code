import type { HttpRequest, HttpResponseInit, InvocationContext } from '@azure/functions';

/**
 * アイテムバルク更新。
 * @param request - HTTP リクエスト
 * @param context - 関数の実行コンテキスト
 * @returns 更新されたアイテム一覧を含む JSON レスポンス
 */
export async function bulkUpdateItems(
  request: HttpRequest,
  context: InvocationContext,
): Promise<HttpResponseInit> {
  const container = request.params.container;
  context.log(`bulk update items: container=${container}`);

  return {
    status: 200,
    jsonBody: { items: [] },
  };
}
