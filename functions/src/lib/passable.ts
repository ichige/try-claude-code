import type { HttpRequest, HttpResponseInit } from '@azure/functions'

/**
 * Pipeline に渡すパッサブルオブジェクト。
 * HTTP リクエストと Zod 検証済みのデータをまとめて保持する。
 */
export class Passable {
  request: HttpRequest
  response: HttpResponseInit
  params: Record<string, string>
  query: Record<string, string>
  body: Record<string, unknown>

  /**
   * @param request - Azure Functions の HTTP リクエスト
   */
  constructor(request: HttpRequest) {
    this.request = request
    this.response = {
      status: 200,
      jsonBody: { success: true },
    }
    this.params = {}
    this.query = {}
    this.body = {}
  }
}
