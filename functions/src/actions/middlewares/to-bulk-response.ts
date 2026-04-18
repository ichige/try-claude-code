import { BulkOperationType } from '@azure/cosmos'
import type { BulkOperationResult, CreateOperationInput, DeleteOperationInput, PatchOperationInput, ReplaceOperationInput } from '@azure/cosmos'
import type { HttpRequest, HttpResponseInit } from '@azure/functions'
import type { AsyncMiddleware } from '../../shared'
import type { Passable } from '../../lib/passable'

/**
 * BulkOperationResult の operationInput から id を取得する。
 * Create 操作は resourceBody.id、Delete / Replace 操作は id を参照する。
 * @param operationInput - バルク操作の入力
 * @returns アイテム ID
 */
function resolveId(operationInput: BulkOperationResult['operationInput']): string {
  switch (operationInput.operationType) {
    case BulkOperationType.Create:
      return String((operationInput as CreateOperationInput).resourceBody.id)
    case BulkOperationType.Delete:
      return (operationInput as DeleteOperationInput).id
    case BulkOperationType.Replace:
      return (operationInput as ReplaceOperationInput).id
    case BulkOperationType.Patch:
      return (operationInput as PatchOperationInput).id
    default:
      throw new Error(`Unsupported operationType: ${operationInput.operationType}`)
  }
}

/**
 * BulkOperationResult の operationInput から成功ステータスコードを取得する。
 * @param operationInput - バルク操作の入力
 * @returns 成功とみなす HTTP ステータスコード
 */
function resolveSuccessCode(operationInput: BulkOperationResult['operationInput']): number {
  switch (operationInput.operationType) {
    case BulkOperationType.Create: return 201
    case BulkOperationType.Delete: return 204
    case BulkOperationType.Replace: return 200
    case BulkOperationType.Patch: return 200
    default:
      throw new Error(`Unsupported operationType: ${operationInput.operationType}`)
  }
}

/**
 * next が返したバルク操作結果をレスポンスに変換するミドルウェア。
 * operationInput の operationType に応じて id と成功判定を解決する。
 * HTTP ステータスは先頭オペレーションの成功ステータスコードに準拠し、
 * Delete（204）の場合は 200 を返す。
 * @param req - HTTP リクエスト
 * @param next - 次のミドルウェアまたは destination
 * @returns レスポンス
 */
export const toBulkResponse: AsyncMiddleware<HttpRequest, HttpResponseInit, BulkOperationResult[]> =
  async (req, next) => {
    const bulkResults = await next(req)
    return {
      status: 200,
      jsonBody: {
        results: bulkResults.map((r) => ({
          id: resolveId(r.operationInput),
          success: r.response?.statusCode === resolveSuccessCode(r.operationInput),
          statusCode: r.response?.statusCode ?? r.error?.code,
        })),
      },
    }
  }

/**
 * next が返したバルク操作結果を passable.response にセットするミドルウェア。
 * @param passable - パッサブルオブジェクト
 * @param next - 次のミドルウェアまたは destination
 * @returns passable
 */
export const toBulkResponse2: AsyncMiddleware<Passable, Passable, BulkOperationResult[]> =
  async (passable, next) => {
    const bulkResults = await next(passable)
    passable.response = {
      status: 200,
      jsonBody: {
        results: bulkResults.map((r) => ({
          id: resolveId(r.operationInput),
          success: r.response?.statusCode === resolveSuccessCode(r.operationInput),
          statusCode: r.response?.statusCode ?? r.error?.code,
        })),
      },
    }
    return passable
  }
