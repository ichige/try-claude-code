import type { PostInvocationContext } from '@azure/functions'
import { NotFoundError } from '../errors'
import type { AsyncMiddleware } from '../shared/index.node'

/**
 * NotFoundError を 404 レスポンスに変換するフックミドルウェア。
 * @param ctx - postInvocation コンテキスト
 * @param next - 次のミドルウェア
 */
export const handleNotFoundError: AsyncMiddleware<PostInvocationContext> = async (ctx, next) => {
  if (ctx.error instanceof NotFoundError) {
    ctx.result = { status: 404, jsonBody: { error: ctx.error.message } }
    ctx.error = undefined
    return ctx
  }
  return next(ctx)
}
