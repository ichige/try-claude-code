import { defineStore, acceptHMRUpdate } from 'pinia'
import { api } from 'src/boot/axios'

export type ContainerName = 'Consignees' | 'Carriers' | 'Forwarders' | 'Consignors'

export const useMastersStore = defineStore('masters', () => {
  /**
   * 指定したコンテナにアイテムを登録する。
   * @param container - 登録先のコンテナ名
   * @param data - フォームの入力値
   */
  async function create(container: ContainerName, data: Record<string, unknown>): Promise<void> {
    await api.post(`/api/create-item/${container}`, data)
  }

  return { create }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useMastersStore, import.meta.hot))
}
