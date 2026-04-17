import { describe, expect, it, vi } from 'vitest'
import { PreconditionFailedError } from '../errors'
import { handlePreconditionFailedError } from './handle-precondition-failed-error'

const createCtx = (error?: unknown) =>
  ({
    error,
    result: undefined as unknown,
    invocationContext: { error: vi.fn() },
    inputs: [],
    hookData: {},
  }) as any

describe('handlePreconditionFailedError', () => {
  it('PreconditionFailedError を 412 レスポンスに変換する', async () => {
    const ctx = createCtx(new PreconditionFailedError())
    await handlePreconditionFailedError(ctx, async (c) => c, null)
    expect(ctx.result).toEqual({ status: 412, jsonBody: { error: 'Precondition Failed' } })
    expect(ctx.error).toBeUndefined()
  })

  it('PreconditionFailedError のメッセージをレスポンスに含める', async () => {
    const ctx = createCtx(new PreconditionFailedError('Custom message'))
    await handlePreconditionFailedError(ctx, async (c) => c, null)
    expect(ctx.result).toMatchObject({ jsonBody: { error: 'Custom message' } })
  })

  it('PreconditionFailedError 以外のエラーは next へ渡す', async () => {
    const ctx = createCtx(new Error('other'))
    const next = vi.fn(async (c: any) => c)
    await handlePreconditionFailedError(ctx, next, null)
    expect(next).toHaveBeenCalledWith(ctx)
    expect(ctx.result).toBeUndefined()
  })
})
