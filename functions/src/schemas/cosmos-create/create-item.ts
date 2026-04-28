import type { HttpRequest } from '@azure/functions'
import { z } from 'zod'
import { containerSchema } from '../container'

/**
 * createItem エンドポイントのパスパラメータスキーマ。
 */
export const createItemParamsSchema = z.object({
  container: containerSchema,
})

/**
 * createItem / bulkCreateItems エンドポイントのリクエストボディスキーマファクトリ。
 * id が未指定の場合は UUID を自動発行する。
 * pk が未指定の場合はコンテナ名から導出する（例: Consignors → pk-consignors）。
 * createdAt / updatedAt / deletedAt / isDeleted はリクエスト値を無視してサーバ側で上書きする。
 * _etag は除外する。
 * その他のフィールドは任意の値を受け付ける。
 * @param req - validateParams 通過済みの HTTP リクエスト
 * @returns Zod スキーマ
 */
export const createItemBodySchema = (req: HttpRequest) => {
  const { container } = req.params
  return z
    .object({
      id: z.string().default(() => crypto.randomUUID()),
      pk: z.string().default(`pk-${container.toLowerCase()}`),
    })
    .catchall(z.unknown())
    .transform((data) => {
      const { _etag: _, createdAt: _c, updatedAt: _u, deletedAt: _d, isDeleted: _i, ...rest } = data
      return {
        ...rest,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        deletedAt: null,
        isDeleted: false,
      }
    })
}
