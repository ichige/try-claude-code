import { defineStore, acceptHMRUpdate } from 'pinia'
import { api } from 'src/boot/axios'
import type { ShipmentsItem } from '@shisamo/shared'

export const useShipmentsStore = defineStore('shipments', () => {
  /**
   * 取引を新規登録する。
   * @param data - 登録内容
   */
  async function create(data: Record<string, unknown>): Promise<ShipmentsItem> {
    const { data: result } = await api.post<{ item: ShipmentsItem }>('/api/create-item/Shipments', data)
    return result.item
  }

  /**
   * 取引を全置換する。
   * @param id - 更新対象の ID
   * @param data - 更新内容（_etag を含む）
   */
  async function update(id: string, data: Record<string, unknown>): Promise<ShipmentsItem> {
    const { data: result } = await api.post<{ item: ShipmentsItem }>(`/api/replace-item/Shipments/${id}`, data)
    return result.item
  }

  /**
   * 取引を部分更新する。
   * @param id - 更新対象の ID
   * @param data - 更新フィールド（_etag を含む）
   */
  async function patch(id: string, data: Record<string, unknown>): Promise<ShipmentsItem> {
    const { data: result } = await api.patch<{ item: ShipmentsItem }>(`/api/update-item/Shipments/${id}`, data)
    return result.item
  }

  return { create, update, patch }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useShipmentsStore, import.meta.hot))
}
