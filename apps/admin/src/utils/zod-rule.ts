import type { z } from 'zod'

/**
 * zod スキーマを Quasar の :rules 用バリデーション関数に変換する。
 * @param schema - バリデーションに使用する zod スキーマ
 * @returns Quasar rules 関数
 */
export function zodRule(schema: z.ZodType) {
  return (v: unknown) => {
    const result = schema.safeParse(v)
    return result.success || result.error.issues[0]?.message || true
  }
}
