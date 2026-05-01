/**
 * 値を 0 以上に制限して返す。
 * @param v - 入力値
 */
export const toNonNegative = (v: unknown): number => Math.max(0, Number(v))
