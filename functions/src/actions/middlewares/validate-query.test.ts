import { describe, expect, it, vi } from 'vitest'
import { z } from 'zod'
import { ValidationError } from '../../errors'
import { Passable } from '../../lib/passable'
import { validateQuery } from './validators'

const createPassable = (query: Record<string, string> = {}) =>
  new Passable({ query: new URLSearchParams(query) } as any)

const schema = z.object({ name: z.string().min(1) })

describe('validateQuery', () => {
  it('検証成功時は query にマージして next へ渡す', async () => {
    const passable = createPassable({ name: 'test' })
    const next = vi.fn(async (p: Passable) => p)
    await validateQuery(schema)(passable, next)
    expect(next).toHaveBeenCalledWith(expect.objectContaining({ query: { name: 'test' } }))
  })

  it('検証失敗時は ValidationError をスローする', async () => {
    const passable = createPassable({ name: '' })
    await expect(validateQuery(schema)(passable, async (p) => p)).rejects.toBeInstanceOf(ValidationError)
  })
})
