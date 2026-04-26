import { defineStore, acceptHMRUpdate } from 'pinia'
import type { ConsigneesItem } from '@shisamo/shared'
import { type MasterStore } from 'stores/masters'
import { createMasterStore } from './factory'

/**
 * 配送先マスタのストア
 */
export const useConsigneesStore = defineStore('masters/consignees', () => {
  const store = createMasterStore<ConsigneesItem>('Consignees')
  return store satisfies MasterStore
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useConsigneesStore, import.meta.hot))
}
