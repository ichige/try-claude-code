import { BulkOperationType } from '@azure/cosmos'
import type { BulkOperationResult } from '@azure/cosmos'
import { describe, expect, it } from 'vitest'
import { toBulkResponse } from './to-bulk-response'

const req = {} as any

const makeCreateResult = (
  id: string,
  statusCode?: number,
  errorCode?: number,
): BulkOperationResult => ({
  operationInput: {
    operationType: BulkOperationType.Create,
    resourceBody: { id, pk: 'pk-consignors' },
  },
  response: statusCode !== undefined ? ({ statusCode, requestCharge: 1 } as any) : undefined,
  error: errorCode !== undefined ? ({ code: errorCode } as any) : undefined,
})

const makeDeleteResult = (
  id: string,
  statusCode?: number,
  errorCode?: number,
): BulkOperationResult => ({
  operationInput: {
    operationType: BulkOperationType.Delete,
    id,
    partitionKey: 'pk-consignors',
  },
  response: statusCode !== undefined ? ({ statusCode, requestCharge: 1 } as any) : undefined,
  error: errorCode !== undefined ? ({ code: errorCode } as any) : undefined,
})

const makeReplaceResult = (
  id: string,
  statusCode?: number,
  errorCode?: number,
): BulkOperationResult => ({
  operationInput: {
    operationType: BulkOperationType.Replace,
    id,
    resourceBody: { id, pk: 'pk-consignors' },
    partitionKey: 'pk-consignors',
  },
  response: statusCode !== undefined ? ({ statusCode, requestCharge: 1 } as any) : undefined,
  error: errorCode !== undefined ? ({ code: errorCode } as any) : undefined,
})

const makePatchResult = (
  id: string,
  statusCode?: number,
  errorCode?: number,
): BulkOperationResult => ({
  operationInput: {
    operationType: BulkOperationType.Patch,
    id,
    resourceBody: { operations: [{ op: 'set', path: '/name', value: 'テスト' }] },
    partitionKey: 'pk-consignors',
  } as any,
  response: statusCode !== undefined ? ({ statusCode, requestCharge: 1 } as any) : undefined,
  error: errorCode !== undefined ? ({ code: errorCode } as any) : undefined,
})

const validId = '6e0b379b-5998-4e91-ba20-443e861b5b8a'

describe('toBulkResponse', () => {
  describe('HTTP ステータス', () => {
    it('200 レスポンスを返す', async () => {
      const result = await toBulkResponse(req, async () => [makeCreateResult(validId, 201)], null)
      expect(result.status).toBe(200)
    })

    it('空配列の場合も 200 を返す', async () => {
      const result = await toBulkResponse(req, async () => [], null)
      expect(result.status).toBe(200)
    })
  })

  describe('Create 操作', () => {
    it('id を resourceBody から取得する', async () => {
      const result = await toBulkResponse(req, async () => [makeCreateResult(validId, 201)], null)
      expect((result.jsonBody as any).results[0].id).toBe(validId)
    })

    it('statusCode 201 のとき success: true', async () => {
      const result = await toBulkResponse(req, async () => [makeCreateResult(validId, 201)], null)
      expect((result.jsonBody as any).results[0].success).toBe(true)
    })

    it('statusCode 201 以外のとき success: false', async () => {
      const result = await toBulkResponse(req, async () => [makeCreateResult(validId, 409)], null)
      expect((result.jsonBody as any).results[0].success).toBe(false)
    })

    it('response の statusCode を含む', async () => {
      const result = await toBulkResponse(req, async () => [makeCreateResult(validId, 201)], null)
      expect((result.jsonBody as any).results[0].statusCode).toBe(201)
    })

    it('response がなく error がある場合は error.code を statusCode に使う', async () => {
      const result = await toBulkResponse(req, async () => [makeCreateResult(validId, undefined, 429)], null)
      expect((result.jsonBody as any).results[0].statusCode).toBe(429)
    })
  })

  describe('Delete 操作', () => {
    it('id を operationInput から直接取得する', async () => {
      const result = await toBulkResponse(req, async () => [makeDeleteResult(validId, 204)], null)
      expect((result.jsonBody as any).results[0].id).toBe(validId)
    })

    it('statusCode 204 のとき success: true', async () => {
      const result = await toBulkResponse(req, async () => [makeDeleteResult(validId, 204)], null)
      expect((result.jsonBody as any).results[0].success).toBe(true)
    })

    it('statusCode 204 以外のとき success: false', async () => {
      const result = await toBulkResponse(req, async () => [makeDeleteResult(validId, 404)], null)
      expect((result.jsonBody as any).results[0].success).toBe(false)
    })

    it('response の statusCode を含む', async () => {
      const result = await toBulkResponse(req, async () => [makeDeleteResult(validId, 204)], null)
      expect((result.jsonBody as any).results[0].statusCode).toBe(204)
    })
  })

  describe('Replace 操作', () => {
    it('id を operationInput から直接取得する', async () => {
      const result = await toBulkResponse(req, async () => [makeReplaceResult(validId, 200)], null)
      expect((result.jsonBody as any).results[0].id).toBe(validId)
    })

    it('statusCode 200 のとき success: true', async () => {
      const result = await toBulkResponse(req, async () => [makeReplaceResult(validId, 200)], null)
      expect((result.jsonBody as any).results[0].success).toBe(true)
    })

    it('statusCode 200 以外のとき success: false', async () => {
      const result = await toBulkResponse(req, async () => [makeReplaceResult(validId, 412)], null)
      expect((result.jsonBody as any).results[0].success).toBe(false)
    })

    it('response の statusCode を含む', async () => {
      const result = await toBulkResponse(req, async () => [makeReplaceResult(validId, 200)], null)
      expect((result.jsonBody as any).results[0].statusCode).toBe(200)
    })
  })

  describe('Patch 操作', () => {
    it('id を operationInput から直接取得する', async () => {
      const result = await toBulkResponse(req, async () => [makePatchResult(validId, 200)], null)
      expect((result.jsonBody as any).results[0].id).toBe(validId)
    })

    it('statusCode 200 のとき success: true', async () => {
      const result = await toBulkResponse(req, async () => [makePatchResult(validId, 200)], null)
      expect((result.jsonBody as any).results[0].success).toBe(true)
    })

    it('statusCode 200 以外のとき success: false', async () => {
      const result = await toBulkResponse(req, async () => [makePatchResult(validId, 412)], null)
      expect((result.jsonBody as any).results[0].success).toBe(false)
    })

    it('response の statusCode を含む', async () => {
      const result = await toBulkResponse(req, async () => [makePatchResult(validId, 200)], null)
      expect((result.jsonBody as any).results[0].statusCode).toBe(200)
    })
  })

  describe('複数アイテム', () => {
    it('複数の Create 結果をまとめて処理する', async () => {
      const id2 = 'a42bf96f-1a69-4530-9575-d1e5181f8c86'
      const result = await toBulkResponse(
        req,
        async () => [makeCreateResult(validId, 201), makeCreateResult(id2, 409)],
        null,
      )
      const results = (result.jsonBody as any).results
      expect(results).toHaveLength(2)
      expect(results[0]).toMatchObject({ id: validId, success: true, statusCode: 201 })
      expect(results[1]).toMatchObject({ id: id2, success: false, statusCode: 409 })
    })

    it('複数の Delete 結果をまとめて処理する', async () => {
      const id2 = 'a42bf96f-1a69-4530-9575-d1e5181f8c86'
      const result = await toBulkResponse(
        req,
        async () => [makeDeleteResult(validId, 204), makeDeleteResult(id2, 404)],
        null,
      )
      const results = (result.jsonBody as any).results
      expect(results).toHaveLength(2)
      expect(results[0]).toMatchObject({ id: validId, success: true, statusCode: 204 })
      expect(results[1]).toMatchObject({ id: id2, success: false, statusCode: 404 })
    })

    it('複数の Replace 結果をまとめて処理する', async () => {
      const id2 = 'a42bf96f-1a69-4530-9575-d1e5181f8c86'
      const result = await toBulkResponse(
        req,
        async () => [makeReplaceResult(validId, 200), makeReplaceResult(id2, 412)],
        null,
      )
      const results = (result.jsonBody as any).results
      expect(results).toHaveLength(2)
      expect(results[0]).toMatchObject({ id: validId, success: true, statusCode: 200 })
      expect(results[1]).toMatchObject({ id: id2, success: false, statusCode: 412 })
    })
  })

  describe('非対応 operationType', () => {
    it('Read 操作でエラーをスローする', async () => {
      const unsupported: BulkOperationResult = {
        operationInput: { operationType: BulkOperationType.Read, id: validId },
        response: { statusCode: 200, requestCharge: 1 } as any,
      }
      await expect(toBulkResponse(req, async () => [unsupported], null)).rejects.toThrow('Unsupported operationType')
    })
  })
})
