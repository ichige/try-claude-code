import { describe, expect, it, vi } from 'vitest'
import { z } from 'zod'
import { ValidationError } from '../errors'
import { handleValidationError } from './handle-validation-error'

const createCtx = (error?: unknown) =>
  ({
    error,
    result: undefined as unknown,
    invocationContext: { error: vi.fn() },
    inputs: [],
    hookData: {},
  }) as any

const makeValidationError = () => {
  const result = z.uuid().safeParse('bad')
  return new ValidationError(result.error!)
}

describe('handleValidationError', () => {
  it('ValidationError を 400 レスポンスに変換する', async () => {
    const ctx = createCtx(makeValidationError())
    await handleValidationError(ctx, async (c) => c, null)
    expect(ctx.result).toMatchObject({ status: 400, jsonBody: { error: 'Validation Error' } })
    expect(ctx.error).toBeUndefined()
  })

  it('details を含める', async () => {
    const ctx = createCtx(makeValidationError())
    await handleValidationError(ctx, async (c) => c, null)
    expect((ctx.result as any).jsonBody.details).toBeDefined()
    expect(Array.isArray((ctx.result as any).jsonBody.details)).toBe(true)
  })

  it('ValidationError 以外のエラーは next へ渡す', async () => {
    const ctx = createCtx(new Error('other'))
    const next = vi.fn(async (c: any) => c)
    await handleValidationError(ctx, next, null)
    expect(next).toHaveBeenCalledWith(ctx)
    expect(ctx.result).toBeUndefined()
  })
})
