import { z } from 'zod'
import { containerSchema } from './container'

/**
 * getItem エンドポイントのパスパラメータスキーマ。
 * pk は省略時にコンテナ名から導出する。
 */
export const getItemParamsSchema = z.object({
  container: containerSchema,
  id: z.uuid(),
  pk: z.string().optional(),
}).transform((data) => ({
  ...data,
  pk: data.pk ?? `pk-${data.container.toLowerCase()}`,
}))
