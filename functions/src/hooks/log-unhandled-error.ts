import type { PostInvocationContext } from '@azure/functions'
import type { AsyncMiddleware } from '../shared/index.node'

/**
 * 未ハンドルのエラーをログに記録し、500 レスポンスを設定するフックミドルウェア。
 * @param ctx - postInvocation コンテキスト
 * @param next - 次のミドルウェア
 */
export const logUnhandledError: AsyncMiddleware<PostInvocationContext> = async (ctx, next) => {
  if (ctx.error) {
    ctx.invocationContext.error('Unhandled error:', ctx.error)
    ctx.result = { status: 500, jsonBody: { error: 'Internal Server Error' } }
    ctx.error = undefined
  }
  return next(ctx)
}
