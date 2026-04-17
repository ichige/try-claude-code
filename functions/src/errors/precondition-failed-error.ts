/**
 * ETag の不一致など前提条件が満たされない場合にスローするエラー。
 * postInvocation フックが 412 レスポンスに変換する。
 */
export class PreconditionFailedError extends Error {
  readonly statusCode = 412

  constructor(message = 'Precondition Failed') {
    super(message)
    this.name = 'PreconditionFailedError'
  }
}
