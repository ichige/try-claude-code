import { defineStore, acceptHMRUpdate } from 'pinia'
import type { CarriersItem } from '@shisamo/shared'
import { type MasterStore } from 'stores/masters'
import { createMasterStore } from './factory'

/**
 * 配送業者マスタのストア
 */
export const useCarriersStore = defineStore('masters/carriers', () => {
  const store = createMasterStore<CarriersItem>('Carriers')
  return store satisfies MasterStore
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useCarriersStore, import.meta.hot))
}
