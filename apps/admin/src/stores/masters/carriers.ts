import { defineStore, acceptHMRUpdate } from 'pinia'
import type { CarriersItem } from '@shisamo/shared'
import { type MasterStore } from 'stores/masters'
import { createMasterStore } from './factory'

/**
 * 配送業者マスタのストア
 */
export const useCarriersStore = defineStore('masters/carriers', () => {
  const store = createMasterStore<CarriersItem>('Carriers')

  /**
   * ID から配送業者名を返す。未設定の場合は '―'、存在しない場合は ID をそのまま返す。
   * @param id - 配送業者 ID
   */
  function nameById(id: string | null | undefined): string {
    if (!id) return '―'
    return store.getById(id)?.companyName ?? id
  }

  return { ...store, nameById } satisfies MasterStore & { nameById: typeof nameById }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useCarriersStore, import.meta.hot))
}
