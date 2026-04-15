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
}
