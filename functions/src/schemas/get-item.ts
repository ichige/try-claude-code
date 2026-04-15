import { z } from 'zod'
import { containerSchema } from './container'

/**
 * getItem エンドポイントのパスパラメータスキーマ。
 */
export const getItemParamsSchema = z.object({
  container: containerSchema,
  id: z.uuid(),
})
