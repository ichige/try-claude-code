import { describe, expect, it, vi } from 'vitest'
import { type AsyncMiddleware, Pipeline } from '.'

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** passable をそのまま next へ渡すだけのミドルウェア */
const passthrough =
  <T>(): AsyncMiddleware<T, T> =>
  async (passable, next) =>
    next(passable)

// ---------------------------------------------------------------------------
// thenReturn
// ---------------------------------------------------------------------------

describe('thenReturn', () => {
  it('passable をそのまま返す', async () => {
    const result = await Pipeline.send({ value: 1 }).thenReturn()
    expect(result).toEqual({ value: 1 })
  })

  it('ミドルウェアなしでも動作する', async () => {
    const result = await Pipeline.send(42).thenReturn()
    expect(result).toBe(42)
  })
})

// ---------------------------------------------------------------------------
// then
// ---------------------------------------------------------------------------

describe('then', () => {
  it('destination の戻り値を返す', async () => {
    const result = await Pipeline.send({ value: 10 }).then(async (p) => p.value * 2)

    expect(result).toBe(20)
  })

  it('destination で型を変換できる', async () => {
    const result = await Pipeline.send({ count: 3 }).then(async (p) => ({
      label: `count: ${p.count}`,
    }))

    expect(result).toEqual({ label: 'count: 3' })
  })
})

// ---------------------------------------------------------------------------
// pipe — 単体
// ---------------------------------------------------------------------------

describe('pipe (単体)', () => {
  it('ミドルウェアが passable を変換できる', async () => {
    const double: AsyncMiddleware<number, number> = async (n, next) => next(n * 2)

    const result = await Pipeline.send(5).pipe(double).thenReturn()

    expect(result).toBe(10)
  })

  it('ミドルウェアが next の後に処理を差し込める', async () => {
    const log: string[] = []
    const mw: AsyncMiddleware<number, number> = async (n, next) => {
      log.push('before')
      const result = await next(n)
      log.push('after')
      return result
    }

    await Pipeline.send(1).pipe(mw).thenReturn()

    expect(log).toEqual(['before', 'after'])
  })

  it('ミドルウェアがレスポンス型を変換できる (T → R)', async () => {
    const stringify: AsyncMiddleware<number, string> = async (n, next) => next(n)

    const result = await Pipeline.send(99)
      .pipe(stringify)
      .then(async (n) => String(n))

    expect(result).toBe('99')
  })
})

// ---------------------------------------------------------------------------
// pipe — 複数・実行順
// ---------------------------------------------------------------------------

describe('pipe (複数)', () => {
  it('ミドルウェアは pipe した順に実行される', async () => {
    const order: string[] = []
    const mw =
      (label: string): AsyncMiddleware<number, number> =>
      async (n, next) => {
        order.push(`${label}:before`)
        const result = await next(n)
        order.push(`${label}:after`)
        return result
      }

    await Pipeline.send(0).pipe(mw('A')).pipe(mw('B')).pipe(mw('C')).thenReturn()

    expect(order).toEqual(['A:before', 'B:before', 'C:before', 'C:after', 'B:after', 'A:after'])
  })

  it('各ミドルウェアが passable を順に変換できる', async () => {
    const add =
      (n: number): AsyncMiddleware<number, number> =>
      async (passable, next) =>
        next(passable + n)

    const result = await Pipeline.send(0).pipe(add(1)).pipe(add(2)).pipe(add(3)).thenReturn()

    expect(result).toBe(6)
  })
})

// ---------------------------------------------------------------------------
// pipe — options
// ---------------------------------------------------------------------------

describe('pipe options', () => {
  it('options がミドルウェアに渡される', async () => {
    type Opts = { multiplier: number }
    const mw: AsyncMiddleware<number, number, Opts> = async (n, next, opts) =>
      next(n * opts.multiplier)

    const result = await Pipeline.send(3).pipe(mw, { multiplier: 4 }).thenReturn()

    expect(result).toBe(12)
  })

  it('options なしのときは null が渡される', async () => {
    let received: unknown = 'not-called'
    const mw: AsyncMiddleware<number, number> = async (n, next, opts) => {
      received = opts
      return next(n)
    }

    await Pipeline.send(1).pipe(mw).thenReturn()

    expect(received).toBeNull()
  })

  it('複数の pipe でそれぞれ異なる options を渡せる', async () => {
    type Opts = { prefix: string }
    const mw: AsyncMiddleware<string, string, Opts> = async (s, next, opts) =>
      next(`${opts.prefix}${s}`)

    const result = await Pipeline.send('world')
      .pipe(mw, { prefix: 'hello ' })
      .pipe(mw, { prefix: '>>> ' })
      .thenReturn()

    expect(result).toBe('>>> hello world')
  })
})

// ---------------------------------------------------------------------------
// finally
// ---------------------------------------------------------------------------

describe('finally', () => {
  it('then の後に finally が呼ばれる', async () => {
    const finallyCb = vi.fn()

    await Pipeline.send(1).finally(finallyCb).thenReturn()

    expect(finallyCb).toHaveBeenCalledOnce()
  })

  it('finally には元の passable が渡される', async () => {
    let captured: unknown
    const double: AsyncMiddleware<number, number> = async (n, next) => next(n * 2)

    await Pipeline.send(5)
      .pipe(double)
      .finally(async (p) => {
        captured = p
      })
      .thenReturn()

    // ミドルウェアで変換された値ではなく、send に渡した元の値
    expect(captured).toBe(5)
  })

  it('ミドルウェアでエラーが発生しても finally は呼ばれる', async () => {
    const finallyCb = vi.fn()
    const boom: AsyncMiddleware<number, number> = async () => {
      throw new Error('boom')
    }

    await expect(Pipeline.send(1).pipe(boom).finally(finallyCb).thenReturn()).rejects.toThrow(
      'boom',
    )

    expect(finallyCb).toHaveBeenCalledOnce()
  })
})

// ---------------------------------------------------------------------------
// エラー伝播
// ---------------------------------------------------------------------------

describe('エラー伝播', () => {
  it('ミドルウェアのエラーがそのまま伝播する', async () => {
    const err = new Error('middleware error')
    const mw: AsyncMiddleware<number, number> = async () => {
      throw err
    }

    await expect(Pipeline.send(1).pipe(mw).thenReturn()).rejects.toThrow(err)
  })

  it('destination のエラーが伝播する', async () => {
    await expect(
      Pipeline.send(1)
        .pipe(passthrough())
        .then(async () => {
          throw new Error('destination error')
        }),
    ).rejects.toThrow('destination error')
  })
})
