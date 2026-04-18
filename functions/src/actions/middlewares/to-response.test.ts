import { describe, expect, it } from 'vitest'
import { Passable } from '../../lib/passable'
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

const createPassable = () => new Passable({ query: new URLSearchParams() } as any)

const getItem = (p: Passable) => (p.response.jsonBody as any).item
const getItems = (p: Passable) => (p.response.jsonBody as any).items

describe('toResponse', () => {
  it('200 レスポンスを返す', async () => {
    const p = await toResponse(createPassable(), async () => cosmosItem, null)
    expect(p.response.status).toBe(200)
  })

  it('item を jsonBody に含める', async () => {
    const p = await toResponse(createPassable(), async () => cosmosItem, null)
    expect(getItem(p)).toBeDefined()
  })

  it('_rid を除外する', async () => {
    const p = await toResponse(createPassable(), async () => cosmosItem, null)
    expect(getItem(p)._rid).toBeUndefined()
  })

  it('_ts を除外する', async () => {
    const p = await toResponse(createPassable(), async () => cosmosItem, null)
    expect(getItem(p)._ts).toBeUndefined()
  })

  it('_self を除外する', async () => {
    const p = await toResponse(createPassable(), async () => cosmosItem, null)
    expect(getItem(p)._self).toBeUndefined()
  })

  it('_attachments を除外する', async () => {
    const p = await toResponse(createPassable(), async () => cosmosItem, null)
    expect(getItem(p)._attachments).toBeUndefined()
  })

  it('_etag は残す', async () => {
    const p = await toResponse(createPassable(), async () => cosmosItem, null)
    expect(getItem(p)._etag).toBe('"test-etag"')
  })

  it('業務データを残す', async () => {
    const p = await toResponse(createPassable(), async () => cosmosItem, null)
    expect(getItem(p)).toMatchObject(baseItem)
  })
})

describe('toResponses', () => {
  it('200 レスポンスを返す', async () => {
    const p = await toResponses(createPassable(), async () => [cosmosItem], null)
    expect(p.response.status).toBe(200)
  })

  it('items を jsonBody に含める', async () => {
    const p = await toResponses(createPassable(), async () => [cosmosItem], null)
    expect(getItems(p)).toBeDefined()
  })

  it('空配列を返す', async () => {
    const p = await toResponses(createPassable(), async () => [], null)
    expect(getItems(p)).toEqual([])
  })

  it('各アイテムのシステムプロパティを除外する', async () => {
    const p = await toResponses(createPassable(), async () => [cosmosItem, cosmosItem], null)
    for (const item of getItems(p)) {
      expect(item._rid).toBeUndefined()
      expect(item._ts).toBeUndefined()
      expect(item._self).toBeUndefined()
      expect(item._attachments).toBeUndefined()
    }
  })

  it('各アイテムの _etag は残す', async () => {
    const p = await toResponses(createPassable(), async () => [cosmosItem], null)
    expect(getItems(p)[0]._etag).toBe('"test-etag"')
  })

  it('各アイテムの業務データを残す', async () => {
    const p = await toResponses(createPassable(), async () => [cosmosItem], null)
    expect(getItems(p)[0]).toMatchObject(baseItem)
  })
})
