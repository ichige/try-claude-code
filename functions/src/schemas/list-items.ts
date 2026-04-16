import { z } from 'zod'
import { containerSchema } from './container'

/**
 * listItems エンドポイントのパスパラメータスキーマ。
 * pk は省略可能で、指定時のみパーティションを絞り込む。
 */
export const listItemsParamsSchema = z.object({
  container: containerSchema,
  pk: z.string().optional(),
})
