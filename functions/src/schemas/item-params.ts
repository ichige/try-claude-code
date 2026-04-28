import { z } from 'zod'
import { containerSchema } from './container'

/**
 * container/id/pk を持つ単一アイテム操作の共通パスパラメータスキーマ。
 * pk は省略時にコンテナ名から導出する。
 */
export const itemParamsSchema = z.object({
  container: containerSchema,
  id: z.string(),
  pk: z.string().optional(),
}).transform((data) => ({
  ...data,
  pk: data.pk ?? `pk-${data.container.toLowerCase()}`,
}))
