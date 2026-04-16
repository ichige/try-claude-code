/**
 * ミドルウェアで受け取る next 関数の定義
 */
export type NextFunction<T, D> = (passable: T) => Promise<D>

/**
 * ミドルウェアの定義(asyncのみ)
 * R: このミドルウェア自身の戻り値型
 * D: next(destination)の戻り値型（デフォルトは R と同じ）
 */
export type AsyncMiddleware<T, R = T, D = R, O = null> = (
  passable: T,
  next: NextFunction<T, D>,
  options: O,
) => Promise<R>

/**
 * パイプラインの最後に実行される関数
 */
type FinallyCallback<T> = (passable: T) => void | Promise<void>

/**
 * ミドルウェアの登録インタフェース
 * R・O は pipe() 時点では未確定で then() 呼び出し時に初めて決まるため、
 * 内部的に any を使用する（外部 API の型安全性は pipe/then シグネチャで保証）
 */
interface PipeEntry<T> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  middleware: AsyncMiddleware<T, any, any, any>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  options: any
}

/**
 * Pipeline
 * Ret: 最初の pipe で確定する戻り値型。未設定の場合は never。
 */
export class Pipeline<T, Ret = never> {
  private _pipes: PipeEntry<T>[] = []
  private _finallyCallback?: FinallyCallback<T>

  private constructor(private readonly _passable: T) {}

  /**
   * Passable の登録かつファクトリ
   */
  static send<P>(passable: P): Pipeline<P, never> {
    return new Pipeline<P>(passable)
  }

  /**
   * ミドルウェアの登録チェーン。
   * 最初の pipe 呼び出しのみ Ret を R に確定し、以降は維持する。
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  pipe<R = any, D = R, O = null>(
    middleware: AsyncMiddleware<T, R, D, O>,
    options?: O,
  ): Pipeline<T, [Ret] extends [never] ? R : Ret> {
    this._pipes.push({ middleware, options: options ?? null })
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return this as unknown as Pipeline<T, [Ret] extends [never] ? R : Ret>
  }

  /**
   * Finally 関数の登録
   */
  finally(callback: FinallyCallback<T>): this {
    this._finallyCallback = callback
    return this
  }

  /**
   * Pipeline 実行
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async then<D = any>(destination: (passable: T) => Promise<D>): Promise<[Ret] extends [never] ? D : Ret> {
    const passable = this._passable

    // destination をシードにすることで、各 middleware の next が Promise<R> を返す
    // reduceRight の accumulator 型は実行時に R に収束するが、各 PipeEntry の R が
    // 不定のため any で受ける（戻り値の型安全性は then<R> シグネチャで保証）
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const pipeline = this._pipes.reduceRight<(p: T) => Promise<any>>(
      (next, { middleware, options }) =>
        (p: T) =>
          middleware(p, next, options),
      destination,
    )

    try {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-explicit-any
      return await pipeline(passable) as any
    } finally {
      if (this._finallyCallback) {
        await this._finallyCallback(passable)
      }
    }
  }

  /**
   * destination なしの実行(純粋なフィルタリング)
   */
  async thenReturn(): Promise<[Ret] extends [never] ? T : Ret> {
    // eslint-disable-next-line @typescript-eslint/require-await
    return this.then(async (passable) => passable as unknown as T)
  }
}
