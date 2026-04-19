import type { PostInvocationContext } from '@azure/functions'
import { PreconditionFailedError } from '../errors'
import type { AsyncMiddleware } from '../shared/index.node'

/**
 * PreconditionFailedError を 412 レスポンスに変換するフックミドルウェア。
 * @param ctx - postInvocation コンテキスト
 * @param next - 次のミドルウェア
 */
export const handlePreconditionFailedError: AsyncMiddleware<PostInvocationContext> = async (ctx, next) => {
  if (ctx.error instanceof PreconditionFailedError) {
    ctx.result = { status: 412, jsonBody: { error: ctx.error.message } }
    ctx.error = undefined
    return ctx
  }
  return next(ctx)
}
