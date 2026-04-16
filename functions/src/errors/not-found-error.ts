/**
 * 対象リソースが存在しない場合にスローするエラー。
 * postInvocation フックが statusCode を元に HTTP レスポンスに変換する。
 */
export class NotFoundError extends Error {
  readonly statusCode = 404

  constructor(message = 'Not Found') {
    super(message)
    this.name = 'NotFoundError'
  }
}
