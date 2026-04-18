import { describe, expect, it, vi } from 'vitest'
import { z } from 'zod'
import { ValidationError } from '../../errors'
import { Passable } from '../../lib/passable'
import { validateParams } from './validators'

const createPassable = (params: Record<string, string>) =>
  new Passable({ params, query: new URLSearchParams() } as any)

const schema = z.object({ name: z.string().min(1) })

describe('validateParams', () => {
  it('検証成功時は params にマージして next へ渡す', async () => {
    const passable = createPassable({ name: 'test' })
    const next = vi.fn(async (p: Passable) => p)
    await validateParams(schema)(passable, next)
    expect(next).toHaveBeenCalledWith(expect.objectContaining({ params: { name: 'test' } }))
  })

  it('検証失敗時は ValidationError をスローする', async () => {
    const passable = createPassable({ name: '' })
    await expect(validateParams(schema)(passable, async (p) => p)).rejects.toBeInstanceOf(ValidationError)
  })

  it('オプショナルフィールドが省略された場合も検証が通る', async () => {
    const optionalSchema = z.object({ name: z.string(), pk: z.string().optional() })
    const passable = createPassable({ name: 'test' })
    const next = vi.fn(async (p: Passable) => p)
    await validateParams(optionalSchema)(passable, next)
    expect(next).toHaveBeenCalledWith(expect.objectContaining({ params: { name: 'test' } }))
  })
})
