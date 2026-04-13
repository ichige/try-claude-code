/**
 * ミドルウェアで受け取る next 関数の定義
 */
export type NextFunction<T, R> = (passable: T) => Promise<R>;

/**
 * ミドルウェアの定義(asyncのみ)
 */
export type AsyncMiddleware<T, R = T, O = null> = (
  passable: T,
  next: NextFunction<T, R>,
  options: O,
) => Promise<R>;

/**
 * パイプラインの最後に実行される関数
 */
type FinallyCallback<T> = (passable: T) => void | Promise<void>;

/**
 * ミドルウェアの登録インタフェース
 * R・O は pipe() 時点では未確定で then() 呼び出し時に初めて決まるため、
 * 内部的に any を使用する（外部 API の型安全性は pipe/then シグネチャで保証）
 */
interface PipeEntry<T> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  middleware: AsyncMiddleware<T, any, any>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  options: any;
}

/**
 * Pipeline
 */
export class Pipeline<T> {
  private _pipes: PipeEntry<T>[] = [];
  private _finallyCallback?: FinallyCallback<T>;

  private constructor(private readonly _passable: T) {}

  /**
   * Passable の登録かつファクトリ
   */
  static send<P>(passable: P): Pipeline<P> {
    return new Pipeline<P>(passable);
  }

  /**
   * ミドルウェアの登録チェーン
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  pipe<R = any, O = null>(middleware: AsyncMiddleware<T, R, O>, options?: O): this {
    this._pipes.push({ middleware, options: options ?? null });
    return this;
  }

  /**
   * Finally 関数の登録
   */
  finally(callback: FinallyCallback<T>): this {
    this._finallyCallback = callback;
    return this;
  }

  /**
   * Pipeline 実行
   */
  async then<R>(destination: (passable: T) => Promise<R>): Promise<R> {
    const passable = this._passable;

    // destination をシードにすることで、各 middleware の next が Promise<R> を返す
    // reduceRight の accumulator 型は実行時に R に収束するが、各 PipeEntry の R が
    // 不定のため any で受ける（戻り値の型安全性は then<R> シグネチャで保証）
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const pipeline = this._pipes.reduceRight<(p: T) => Promise<any>>(
      (next, { middleware, options }) =>
        (p: T) =>
          middleware(p, next, options),
      destination,
    );

    try {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return await pipeline(passable);
    } finally {
      if (this._finallyCallback) {
        await this._finallyCallback(passable);
      }
    }
  }

  /**
   * destination なしの実行(純粋なフィルタリング)
   */
  async thenReturn(): Promise<T> {
    // eslint-disable-next-line @typescript-eslint/require-await
    return this.then(async (passable) => passable);
  }
}
