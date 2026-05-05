import { defineStore, acceptHMRUpdate } from 'pinia'
import { ref, computed } from 'vue'
import { api } from 'src/boot/axios'
import type { ShipmentsItem } from '@shisamo/shared'
import { useAppStore } from 'stores/app'

export const useShipmentsStore = defineStore('shipments', () => {
  const items = ref(new Map<string, ShipmentsItem>())
  const list = computed(() => Array.from(items.value.values()))
  const currentMonth = ref<string | null>(null)

  /**
   * 処理月が変わった場合に再取得が必要かどうか。
   */
  const needsRefetch = computed(() => currentMonth.value !== useAppStore().processingMonth)

  /**
   * 処理月の取引一覧を取得し、items を全入れ替えする。
   */
  async function fetchAll(): Promise<void> {
    const { processingMonth } = useAppStore()
    const { data } = await api.get<{ items: ShipmentsItem[] }>(`/api/item-list/Shipments/${processingMonth}`)
    items.value = new Map(data.items.map((item) => [item.id, item]))
    currentMonth.value = processingMonth
  }

  /**
   * 処理月が変わった場合のみ fetchAll を実行する。prefetch-guard から呼ばれる。
   */
  async function prefetch(): Promise<void> {
    if (!needsRefetch.value) return
    await fetchAll()
  }

  /**
   * 取引を新規登録する。
   * @param data - 登録内容
   */
  async function create(data: Record<string, unknown>): Promise<ShipmentsItem> {
    const { data: result } = await api.post<{ item: ShipmentsItem }>('/api/create-item/Shipments', data)
    const item = result.item
    if (item.pk === currentMonth.value) {
      items.value.set(item.id, item)
    }
    return item
  }

  /**
   * 取引を全置換する。
   * @param id - 更新対象の ID
   * @param data - 更新内容（_etag を含む）
   */
  async function update(id: string, data: Record<string, unknown>): Promise<ShipmentsItem> {
    const { data: result } = await api.post<{ item: ShipmentsItem }>(`/api/replace-item/Shipments/${id}`, data)
    const item = result.item
    if (item.pk === currentMonth.value) {
      items.value.set(item.id, item)
    }
    return item
  }

  /**
   * 取引を部分更新する。
   * @param id - 更新対象の ID
   * @param data - 更新フィールド（_etag を含む）
   */
  async function patch(id: string, data: Record<string, unknown>): Promise<ShipmentsItem> {
    const { data: result } = await api.patch<{ item: ShipmentsItem }>(`/api/update-item/Shipments/${id}`, data)
    const item = result.item
    if (item.pk === currentMonth.value) {
      items.value.set(item.id, item)
    }
    return item
  }

  return { items, list, currentMonth, needsRefetch, fetchAll, prefetch, create, update, patch }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useShipmentsStore, import.meta.hot))
}
