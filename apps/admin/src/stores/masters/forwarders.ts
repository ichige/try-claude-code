import { defineStore, acceptHMRUpdate } from 'pinia'
import type { ForwardersItem } from '@shisamo/shared'
import { type MasterStore } from 'stores/masters'
import { createMasterStore } from './factory'

/**
 * 地点(起点・終点)マスタのストア
 */
export const useForwardersStore = defineStore('masters/forwarders', () => {
  const store = createMasterStore<ForwardersItem>('Forwarders')
  return store satisfies MasterStore
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useForwardersStore, import.meta.hot))
}
