import { defineStore, acceptHMRUpdate } from 'pinia'
import { ref, computed } from 'vue'
import type { ConsignorsItem } from '@shisamo/shared'
import { useMastersStore } from 'stores/masters'

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
   * 指定した ID のアイテムを返す。
   * @param id - アイテムの ID
   * @returns 該当アイテム。存在しない場合は undefined
   */
  function getById(id: string): ConsignorsItem | undefined {
    return items.value.get(id)
  }

  return { items, list, fetchAll, getById }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useConsignorsStore, import.meta.hot))
}
