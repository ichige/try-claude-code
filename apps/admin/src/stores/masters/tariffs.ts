import { defineStore, acceptHMRUpdate } from 'pinia'
import type { TariffsItem } from '@shisamo/shared'
import { type MasterStore } from 'stores/masters'
import { createMasterStore } from './factory'

/**
 * 運賃マスタのストア
 */
export const useTariffsStore = defineStore('masters/tariffs', () => {
  const store = createMasterStore<TariffsItem>('Tariffs')
  return store satisfies MasterStore
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useTariffsStore, import.meta.hot))
}
