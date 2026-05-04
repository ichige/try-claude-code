import { defineStore, acceptHMRUpdate } from 'pinia'
import type { ConsignorsItem } from '@shisamo/shared'
import { type MasterStore } from 'stores/masters'
import { createMasterStore } from './factory'

/**
 * 取引先マスタのストア
 */
export const useConsignorsStore = defineStore('masters/consignors', () => {
  const store = createMasterStore<ConsignorsItem>('Consignors')

  /**
   * ID から取引先名を返す。存在しない場合は ID をそのまま返す。
   * @param id - 取引先 ID
   */
  function nameById(id: string): string {
    return store.getById(id)?.companyName ?? id
  }

  return { ...store, nameById } satisfies MasterStore & { nameById: typeof nameById }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useConsignorsStore, import.meta.hot))
}
