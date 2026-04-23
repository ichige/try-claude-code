import { defineStore, acceptHMRUpdate } from 'pinia'
import { ref } from 'vue'
import { api } from 'src/boot/axios'
import type { CosmosItem } from '@shisamo/shared'
import { useConsignorsStore } from 'stores/masters/consignors'

export type ContainerName = 'Consignees' | 'Carriers' | 'Forwarders' | 'Consignors'

export const useMastersStore = defineStore('masters', () => {
  const loaded = ref(false)

  /**
   * 指定したコンテナのアイテム一覧を取得する。
   * @param container - 取得対象のコンテナ名
   * @returns アイテムの配列
   */
  async function list<T extends CosmosItem>(container: ContainerName): Promise<T[]> {
    const { data } = await api.get<{ items: T[] }>(`/api/item-list/${container}`)
    return data.items
  }

  /**
   * 指定したコンテナにアイテムを登録する。
   * @param container - 登録先のコンテナ名
   * @param data - フォームの入力値
   */
  async function create(container: ContainerName, data: Record<string, unknown>): Promise<void> {
    await api.post(`/api/create-item2/${container}`, data)
  }

  /**
   * 全マスタストアのデータを一括取得する。
   */
  async function prefetch(): Promise<void> {
    await useConsignorsStore().fetchAll()
    loaded.value = true
  }

  return { loaded, list, create, prefetch }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useMastersStore, import.meta.hot))
}
