import {
  app,
  type HttpRequest,
  type HttpResponseInit,
  type InvocationContext,
} from '@azure/functions';
import { hello, Pipeline } from '../shared';

/**
 * Hello World エンドポイント。
 * @param request - HTTP リクエスト
 * @param context - 関数の実行コンテキスト
 * @returns 挨拶メッセージを含む JSON レスポンス
 */
async function helloWorld(
  request: HttpRequest,
  context: InvocationContext,
): Promise<HttpResponseInit> {
  context.log('hello-world function processed a request.');

  const name = request.query.get('name') ?? 'World';

  const message = await Pipeline.send(hello(name)).then(async (msg) => `${msg} (via Pipeline)`);

  return {
    status: 200,
    jsonBody: { message },
  };
}

app.http('hello-world', {
  methods: ['GET'],
  authLevel: 'anonymous',
  handler: helloWorld,
});
