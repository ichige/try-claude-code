import { defineStore, acceptHMRUpdate } from 'pinia'
import type { ForwardersItem } from '@shisamo/shared'
import { type MasterStore } from 'stores/masters'
import { createMasterStore } from './factory'

export const useForwardersStore = defineStore('masters/forwarders', () => {
  const store = createMasterStore<ForwardersItem>('Forwarders')
  return store satisfies MasterStore
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useForwardersStore, import.meta.hot))
}
