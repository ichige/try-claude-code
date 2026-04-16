import { describe, expect, it } from 'vitest'
import { toResponse, toResponses } from './to-response'

const baseItem = {
  id: 'test-id',
  pk: 'test-pk',
  createdAt: '2024-01-01T00:00:00.000Z',
  updatedAt: '2024-01-01T00:00:00.000Z',
  deletedAt: null,
  isDeleted: false,
  _etag: '"test-etag"',
}

const cosmosItem = {
  ...baseItem,
  _rid: 'test-rid',
  _ts: 1234567890,
  _self: 'dbs/test/colls/test/docs/test/',
  _attachments: 'attachments/',
}

const req = {} as any

describe('toResponse', () => {
  it('200 レスポンスを返す', async () => {
    const result = await toResponse(req, async () => cosmosItem, null)
    expect(result.status).toBe(200)
  })

  it('item を jsonBody に含める', async () => {
    const result = await toResponse(req, async () => cosmosItem, null)
    expect((result.jsonBody as any).item).toBeDefined()
  })

  it('_rid を除外する', async () => {
    const result = await toResponse(req, async () => cosmosItem, null)
    expect((result.jsonBody as any).item._rid).toBeUndefined()
  })

  it('_ts を除外する', async () => {
    const result = await toResponse(req, async () => cosmosItem, null)
    expect((result.jsonBody as any).item._ts).toBeUndefined()
  })

  it('_self を除外する', async () => {
    const result = await toResponse(req, async () => cosmosItem, null)
    expect((result.jsonBody as any).item._self).toBeUndefined()
  })

  it('_attachments を除外する', async () => {
    const result = await toResponse(req, async () => cosmosItem, null)
    expect((result.jsonBody as any).item._attachments).toBeUndefined()
  })

  it('_etag は残す', async () => {
    const result = await toResponse(req, async () => cosmosItem, null)
    expect((result.jsonBody as any).item._etag).toBe('"test-etag"')
  })

  it('業務データを残す', async () => {
    const result = await toResponse(req, async () => cosmosItem, null)
    const item = (result.jsonBody as any).item
    expect(item).toMatchObject(baseItem)
  })
})

// ---------------------------------------------------------------------------
// toResponses
// ---------------------------------------------------------------------------

describe('toResponses', () => {
  it('200 レスポンスを返す', async () => {
    const result = await toResponses(req, async () => [cosmosItem], null)
    expect(result.status).toBe(200)
  })

  it('items を jsonBody に含める', async () => {
    const result = await toResponses(req, async () => [cosmosItem], null)
    expect((result.jsonBody as any).items).toBeDefined()
  })

  it('空配列を返す', async () => {
    const result = await toResponses(req, async () => [], null)
    expect((result.jsonBody as any).items).toEqual([])
  })

  it('各アイテムのシステムプロパティを除外する', async () => {
    const result = await toResponses(req, async () => [cosmosItem, cosmosItem], null)
    const items = (result.jsonBody as any).items
    for (const item of items) {
      expect(item._rid).toBeUndefined()
      expect(item._ts).toBeUndefined()
      expect(item._self).toBeUndefined()
      expect(item._attachments).toBeUndefined()
    }
  })

  it('各アイテムの _etag は残す', async () => {
    const result = await toResponses(req, async () => [cosmosItem], null)
    expect((result.jsonBody as any).items[0]._etag).toBe('"test-etag"')
  })

  it('各アイテムの業務データを残す', async () => {
    const result = await toResponses(req, async () => [cosmosItem], null)
    expect((result.jsonBody as any).items[0]).toMatchObject(baseItem)
  })
})
