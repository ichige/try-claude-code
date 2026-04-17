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
 * 単一アイテムの本文スキーマファクトリ（createItemBodySchema / bulkCreateItemsBodySchema で共用）。
 * id が未指定の場合は UUID を自動発行する。
 * pk が未指定の場合はコンテナ名から導出する（例: Consignors → pk-consignors）。
 * createdAt / updatedAt / deletedAt / isDeleted はリクエスト値を無視してサーバ側で上書きする。
 * _etag は除外する。
 * その他のフィールドは任意の値を受け付ける。
 * @param container - コンテナ名（safeData.container から取り出した値）
 * @returns Zod スキーマ
 */
export const createItemSchema = (container: string) =>
  z
    .object({
      id: z.uuid().default(() => crypto.randomUUID()),
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

/**
 * createItem エンドポイントのリクエストボディスキーマファクトリ。
 * validateBody ミドルウェアに直接渡せるよう HttpRequest を受け取り、
 * safeData.container からコンテナ名を取り出してスキーマを生成する。
 * @param req - validateParams 通過済みの HTTP リクエスト（safeData.container が必須）
 * @returns Zod スキーマ
 */
export const createItemBodySchema = (req: HttpRequest) => {
  const { container } = (req as HttpRequest & { safeData: { container: string } }).safeData
  return createItemSchema(container)
}
