import type { ZodError } from 'zod'

/**
 * バリデーション失敗時にスローするエラー。
 * postInvocation フックが 400 レスポンスに変換する。
 */
export class ValidationError extends Error {
  readonly statusCode = 400
  readonly details: ZodError['issues']

  constructor(error: ZodError) {
    super('Validation Error')
    this.name = 'ValidationError'
    this.details = error.issues
  }
}
