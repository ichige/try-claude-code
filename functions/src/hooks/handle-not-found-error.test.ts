import { describe, expect, it, vi } from 'vitest'
import { NotFoundError } from '../errors'
import { handleNotFoundError } from './handle-not-found-error'

const createCtx = (error?: unknown) =>
  ({
    error,
    result: undefined as unknown,
    invocationContext: { error: vi.fn() },
    inputs: [],
    hookData: {},
  }) as any

describe('handleNotFoundError', () => {
  it('NotFoundError を 404 レスポンスに変換する', async () => {
    const ctx = createCtx(new NotFoundError())
    await handleNotFoundError(ctx, async (c) => c, null)
    expect(ctx.result).toEqual({ status: 404, jsonBody: { error: 'Not Found' } })
    expect(ctx.error).toBeUndefined()
  })

  it('NotFoundError のメッセージをレスポンスに含める', async () => {
    const ctx = createCtx(new NotFoundError('Custom message'))
    await handleNotFoundError(ctx, async (c) => c, null)
    expect(ctx.result).toMatchObject({ jsonBody: { error: 'Custom message' } })
  })

  it('NotFoundError 以外のエラーは next へ渡す', async () => {
    const ctx = createCtx(new Error('other'))
    const next = vi.fn(async (c: any) => c)
    await handleNotFoundError(ctx, next, null)
    expect(next).toHaveBeenCalledWith(ctx)
    expect(ctx.result).toBeUndefined()
  })
})
