import type { PostInvocationContext } from '@azure/functions'
import { ValidationError } from '../errors'
import type { AsyncMiddleware } from '../shared/index.node'

/**
 * ValidationError を 400 レスポンスに変換するフックミドルウェア。
 * @param ctx - postInvocation コンテキスト
 * @param next - 次のミドルウェア
 */
export const handleValidationError: AsyncMiddleware<PostInvocationContext> = async (ctx, next) => {
  if (ctx.error instanceof ValidationError) {
    ctx.result = { status: 400, jsonBody: { error: ctx.error.message, details: ctx.error.details } }
    ctx.error = undefined
    return ctx
  }
  return next(ctx)
}
