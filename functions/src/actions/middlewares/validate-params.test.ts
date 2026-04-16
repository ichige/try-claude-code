import { describe, expect, it, vi } from 'vitest'
import { z } from 'zod'
import { ValidationError } from '../../errors'
import { validateParams } from './validate-params'

const createReq = (params: Record<string, string>, query: Record<string, string> = {}) =>
  ({
    params,
    query: new URLSearchParams(query),
  }) as any

const schema = z.object({ name: z.string().min(1) })

describe('validateParams', () => {
  it('検証成功時は safeData を付与して next へ渡す', async () => {
    const req = createReq({ name: 'test' })
    const next = vi.fn(async (r: any) => r)
    await validateParams(req, next, schema)
    expect(next).toHaveBeenCalledWith(expect.objectContaining({ safeData: { name: 'test' } }))
  })

  it('検証失敗時は ValidationError をスローする', async () => {
    const req = createReq({ name: '' })
    await expect(validateParams(req, async (r) => r, schema)).rejects.toBeInstanceOf(ValidationError)
  })

})
