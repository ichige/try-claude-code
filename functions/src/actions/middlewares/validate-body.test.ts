import { describe, expect, it, vi } from 'vitest'
import { z } from 'zod'
import { ValidationError } from '../../errors'
import { validateBody } from './validate-body'

const schema = z.object({ name: z.string().min(1) })

const createReq = (body: unknown) =>
  ({
    json: async () => body,
  }) as any

describe('validateBody', () => {
  it('検証成功時は safeBody を付与して next へ渡す', async () => {
    const req = createReq({ name: 'test' })
    const next = vi.fn(async (r: any) => r)
    await validateBody(req, next, schema)
    expect(next).toHaveBeenCalledWith(expect.objectContaining({ safeBody: { name: 'test' } }))
  })

  it('検証失敗時は ValidationError をスローする', async () => {
    const req = createReq({ name: '' })
    await expect(validateBody(req, async (r) => r, schema)).rejects.toBeInstanceOf(ValidationError)
  })

  it('safeData（path params）を上書きしない', async () => {
    const req = { ...createReq({ name: 'test' }), safeData: { container: 'Consignors' } }
    const next = vi.fn(async (r: any) => r)
    await validateBody(req, next, schema)
    expect(next).toHaveBeenCalledWith(expect.objectContaining({ safeData: { container: 'Consignors' } }))
  })
})
