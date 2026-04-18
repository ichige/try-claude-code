import { describe, expect, it, vi } from 'vitest'
import { z } from 'zod'
import { ValidationError } from '../../errors'
import { Passable } from '../../lib/passable'
import { validateBody } from './validators'

const createPassable = (body: unknown) =>
  new Passable({ json: async () => body, query: new URLSearchParams() } as any)

const schema = z.object({ name: z.string().min(1) })

describe('validateBody', () => {
  it('検証成功時は body にセットして next へ渡す', async () => {
    const passable = createPassable({ name: 'test' })
    const next = vi.fn(async (p: Passable) => p)
    await validateBody(schema)(passable, next)
    expect(next).toHaveBeenCalledWith(expect.objectContaining({ body: { name: 'test' } }))
  })

  it('検証失敗時は ValidationError をスローする', async () => {
    const passable = createPassable({ name: '' })
    await expect(validateBody(schema)(passable, async (p) => p)).rejects.toBeInstanceOf(ValidationError)
  })

  it('配列スキーマも検証できる', async () => {
    const arraySchema = z.array(z.string())
    const passable = createPassable(['a', 'b'])
    const next = vi.fn(async (p: Passable) => p)
    await validateBody(arraySchema)(passable, next)
    expect(next).toHaveBeenCalledWith(expect.objectContaining({ body: ['a', 'b'] }))
  })

  it('ファクトリ関数を渡した場合は request からスキーマを生成して検証する', async () => {
    const passable = createPassable({ name: 'test' })
    const next = vi.fn(async (p: Passable) => p)
    await validateBody(() => schema)(passable, next)
    expect(next).toHaveBeenCalledWith(expect.objectContaining({ body: { name: 'test' } }))
  })

  it('ファクトリ関数が返すスキーマで検証失敗した場合は ValidationError をスローする', async () => {
    const passable = createPassable({ name: '' })
    await expect(validateBody(() => schema)(passable, async (p) => p)).rejects.toBeInstanceOf(ValidationError)
  })
})
