import { defineStore, acceptHMRUpdate } from 'pinia'
import { ref, computed } from 'vue'
import type { ConsignorsItem } from '@shisamo/shared'
import { useMastersStore, type MasterStore } from 'stores/masters'

export const useConsignorsStore = defineStore('masters/consignors', () => {
  const masters = useMastersStore()

  /**
   * id をキーとした Consignors アイテムの Map。
   */
  const items = ref(new Map<string, ConsignorsItem>())

  /**
   * items を配列に変換したリスト。
   */
  const list = computed(() => Array.from(items.value.values()))

  /**
   * Consignors コンテナのアイテム一覧を取得し、Map に格納する。
   */
  async function fetchAll(): Promise<void> {
    const list = await masters.list<ConsignorsItem>('Consignors')
    items.value = new Map(list.map((item) => [item.id, item]))
  }

  /**
   * Consignors コンテナにアイテムを登録し、items に追加する。
   * @param data - フォームの入力値
   */
  async function create(data: Record<string, unknown>): Promise<void> {
    const item = await masters.create<ConsignorsItem>('Consignors', data)
    items.value.set(item.id, item)
  }

  /**
   * Consignors コンテナのアイテムを全置換し、items を更新する。
   * @param id - 更新対象のアイテム ID
   * @param data - フォームの入力値（_etag を含む）
   */
  async function update(id: string, data: Record<string, unknown>): Promise<void> {
    const item = await masters.update<ConsignorsItem>('Consignors', id, data)
    items.value.set(item.id, item)
  }

  /**
   * 指定した ID のアイテムを返す。
   * @param id - アイテムの ID
   * @returns 該当アイテム。存在しない場合は undefined
   */
  function getById(id: string): ConsignorsItem | undefined {
    return items.value.get(id)
  }

  const store = { items, list, fetchAll, create, update, getById }
  return store satisfies MasterStore
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useConsignorsStore, import.meta.hot))
}
