import type { z } from 'zod'
import { Pipeline, type AsyncMiddleware } from '@shisamo/shared'

type MessageMiddleware = AsyncMiddleware<string, string>

/**
 * メッセージ内の {field} プレースホルダをフィールド表示名に置換する。
 * zod スキーマのエラーメッセージに i18n キーを渡し、フィールド名を動的に補間するために使用する。
 */
const fieldReplace = (fieldLabel: string): MessageMiddleware =>
  async (message, next) => next(message.replace('{field}', fieldLabel))

/**
 * zod スキーマを Quasar の :rules 用バリデーション関数に変換する。
 * @param schema - バリデーションに使用する zod スキーマ
 * @param fieldLabel - {field} プレースホルダを置換するフィールド表示名
 * @returns Quasar rules 関数
 */
export function zodRule(schema: z.ZodType, fieldLabel = '') {
  return async (v: unknown): Promise<string | true> => {
    const result = schema.safeParse(v)
    if (result.success) return true
    const message = result.error.issues[0]?.message
    if (!message) return true

    return Pipeline.send(message)
      .pipe(fieldReplace(fieldLabel))
      .thenReturn()
  }
}
