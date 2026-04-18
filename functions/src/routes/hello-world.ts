import { app, type HttpRequest, type HttpResponseInit, type InvocationContext } from '@azure/functions'
import { z } from 'zod'
import { Passable } from '../lib/passable'
import { validateQuery } from '../actions/middlewares'
import { Pipeline } from '../shared'

const querySchema = z.object({
  name: z.string().default('World'),
})

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
  context.log('hello-world function processed a request.')

  const passable = await Pipeline.send(new Passable(request))
    .pipe(validateQuery(querySchema))
    .then(async (p) => {
      const name = p.getQuery('name', 'World')!
      p.response = { status: 200, jsonBody: { message: `Hello, ${name}!` } }
      return p
    })

  return passable.response
}

app.http('hello-world', {
  methods: ['GET'],
  authLevel: 'anonymous',
  handler: helloWorld,
})
