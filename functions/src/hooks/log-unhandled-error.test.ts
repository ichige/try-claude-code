import { describe, expect, it, vi } from 'vitest'
import { logUnhandledError } from './log-unhandled-error'

const createCtx = (error?: unknown) => {
  const invocationContext = { error: vi.fn() }
  return {
    error,
    result: undefined as unknown,
    invocationContext,
    inputs: [],
    hookData: {},
  } as any
}

describe('logUnhandledError', () => {
  it('エラーを 500 レスポンスに変換する', async () => {
    const ctx = createCtx(new Error('boom'))
    await logUnhandledError(ctx, async (c) => c, null)
    expect(ctx.result).toEqual({ status: 500, jsonBody: { error: 'Internal Server Error' } })
    expect(ctx.error).toBeUndefined()
  })

  it('エラーをログに記録する', async () => {
    const error = new Error('boom')
    const ctx = createCtx(error)
    await logUnhandledError(ctx, async (c) => c, null)
    expect(ctx.invocationContext.error).toHaveBeenCalledWith('Unhandled error:', error)
  })

  it('エラーがない場合は next へ渡す', async () => {
    const ctx = createCtx()
    const next = vi.fn(async (c: any) => c)
    await logUnhandledError(ctx, next, null)
    expect(next).toHaveBeenCalledWith(ctx)
    expect(ctx.result).toBeUndefined()
  })
})
