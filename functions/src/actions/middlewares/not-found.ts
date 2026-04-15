import type { HttpRequest, HttpResponseInit } from '@azure/functions'
import type { AsyncMiddleware } from '../../shared'

/**
 * next が null を返した場合に 404 レスポンスを返すミドルウェア。
 * @param req - HTTP リクエスト
 * @param next - 次のミドルウェアまたは destination
 * @returns 404 レスポンス、または next の結果
 */
export const notFound: AsyncMiddleware<HttpRequest, HttpResponseInit, HttpResponseInit | null> =
  async (req, next) => {
    const response = await next(req)
    if (!response) return { status: 404, jsonBody: { error: 'Not found' } }
    return response
  }
