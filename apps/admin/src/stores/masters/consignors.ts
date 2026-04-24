import { defineStore, acceptHMRUpdate } from 'pinia'
import type { ConsignorsItem } from '@shisamo/shared'
import { type MasterStore } from 'stores/masters'
import { createMasterStore } from './factory'

export const useConsignorsStore = defineStore('masters/consignors', () => {
  const store = createMasterStore<ConsignorsItem>('Consignors')
  return store satisfies MasterStore
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useConsignorsStore, import.meta.hot))
}
