/**
 * バルク操作の各アイテム結果。
 */
export interface BulkOperationResult {
  /** 対象アイテムの ID */
  id: string
  /** 削除成功の場合 true（statusCode 204）、対象なしの場合 false（statusCode 404） */
  deleted: boolean
  /** Cosmos DB が返した HTTP ステータスコード */
  statusCode: number | undefined
}

/**
 * バルク削除レスポンス。
 */
export interface BulkDeleteResponse {
  results: BulkOperationResult[]
}

/**
 * Cosmos DB コンテナアイテムの基底インタフェース。
 * すべてのドキュメントはこのインタフェースを拡張する。
 */
export interface CosmosItem {
  /** ドキュメントの一意識別子 */
  id: string
  /** パーティションキー */
  pk: string
  /** 作成日時（ISO 8601） */
  createdAt: string
  /** 更新日時（ISO 8601） */
  updatedAt: string
  /** 削除日時（ISO 8601）。未削除の場合は null */
  deletedAt: string | null
  /** 論理削除フラグ */
  isDeleted: boolean
  /** Cosmos DB が管理する ETag。楽観的同時実行制御に使用する */
  _etag: string
}
