import { defineStore, acceptHMRUpdate } from 'pinia'
import { ref, computed } from 'vue'
import type { CarriersItem } from '@shisamo/shared'
import { useMastersStore, type MasterStore } from 'stores/masters'

export const useCarriersStore = defineStore('masters/carriers', () => {
  const masters = useMastersStore()

  /**
   * id をキーとした Carriers アイテムの Map。
   */
  const items = ref(new Map<string, CarriersItem>())

  /**
   * items を配列に変換したリスト。
   */
  const list = computed(() => Array.from(items.value.values()))

  /**
   * Carriers コンテナのアイテム一覧を取得し、Map に格納する。
   */
  async function fetchAll(): Promise<void> {
    const list = await masters.list<CarriersItem>('Carriers')
    items.value = new Map(list.map((item) => [item.id, item]))
  }

  /**
   * Carriers コンテナにアイテムを登録し、items に追加する。
   * @param data - フォームの入力値
   */
  async function create(data: Record<string, unknown>): Promise<void> {
    const item = await masters.create<CarriersItem>('Carriers', data)
    items.value.set(item.id, item)
  }

  /**
   * 指定した ID のアイテムを返す。
   * @param id - アイテムの ID
   * @returns 該当アイテム。存在しない場合は undefined
   */
  function getById(id: string): CarriersItem | undefined {
    return items.value.get(id)
  }

  const store = { items, list, fetchAll, create, getById }
  return store satisfies MasterStore
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useCarriersStore, import.meta.hot))
}
