import { app, type HttpRequest, type HttpResponseInit, type InvocationContext } from '@azure/functions';

/**
 * Hello World エンドポイント。
 * クエリパラメータ `name` を受け取り、挨拶メッセージを返す。
 * @param request - HTTP リクエスト
 * @param context - 関数の実行コンテキスト
 * @returns 挨拶メッセージを含む JSON レスポンス
 */
async function helloWorld(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  context.log('hello-world function processed a request.');

  const name = request.query.get('name') ?? 'World';

  return {
    status: 200,
    jsonBody: { message: `Hello, ${name}!` },
  };
}

app.http('hello-world', {
  methods: ['GET'],
  authLevel: 'anonymous',
  handler: helloWorld,
});
