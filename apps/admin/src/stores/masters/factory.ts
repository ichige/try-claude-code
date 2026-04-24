import { ref, computed, type Ref } from 'vue'
import type { CosmosItem } from '@shisamo/shared'
import { useMastersStore, type ContainerName } from 'stores/masters'

/**
 * マスタストアの共通ロジックを生成するファクトリ関数。
 * @param container - 操作対象のコンテナ名
 * @returns items・list・fetchAll・create・update・getById
 */
export function createMasterStore<T extends CosmosItem>(container: ContainerName) {
  const masters = useMastersStore()
  const items = ref(new Map<string, T>()) as Ref<Map<string, T>>
  const list = computed(() => Array.from(items.value.values()))

  /**
   * 全件取得(prefetch-guardでコールされる)
   */
  async function fetchAll(): Promise<void> {
    const fetched = await masters.list<T>(container)
    items.value = new Map(fetched.map((item) => [item.id, item]))
  }

  /**
   * @param data - フォームの入力値
   */
  async function create(data: Record<string, unknown>): Promise<void> {
    const item = await masters.create<T>(container, data)
    items.value.set(item.id, item)
  }

  /**
   * @param id - 更新対象のアイテム ID
   * @param data - フォームの入力値（_etag を含む）
   */
  async function update(id: string, data: Record<string, unknown>): Promise<void> {
    const item = await masters.update<T>(container, id, data)
    items.value.set(item.id, item)
  }

  /**
   * 論理削除（isDeleted: true に更新）。
   * @param id - 削除対象のアイテム ID
   * @param etag - 楽観的同時実行制御用 ETag
   */
  async function softDelete(id: string, etag: string): Promise<void> {
    const item = await masters.patch<T>(container, id, {
      _etag: etag,
      isDeleted: true,
    })
    items.value.set(item.id, item)
  }

  /**
   * 論理削除を解除（isDeleted: false に更新）。
   * @param id - 復元対象のアイテム ID
   * @param etag - 楽観的同時実行制御用 ETag
   */
  async function restore(id: string, etag: string): Promise<void> {
    const item = await masters.patch<T>(container, id, {
      _etag: etag,
      isDeleted: false,
    })
    items.value.set(item.id, item)
  }

  /**
   * @param id - アイテムの ID
   * @returns 該当アイテム。存在しない場合は undefined
   */
  function getById(id: string): T | undefined {
    return items.value.get(id)
  }

  return { items, list, fetchAll, create, update, delete: softDelete, restore, getById }
}
