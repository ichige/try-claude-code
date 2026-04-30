import { defineStore, acceptHMRUpdate } from 'pinia'
import type { ChargeItems } from '@shisamo/shared'
import { useMastersStore, type MasterStore } from 'stores/masters'
import { createMasterStore } from './factory'

/**
 * 付帯料金マスタのストア
 */
export const useChargesStore = defineStore('masters/charges', () => {
  const masters = useMastersStore()
  const store = createMasterStore<ChargeItems>('Charges')

  /**
   * 運用開始フラグを有効化する。一度 true にすると以後変更不可。
   * @param charge - 対象の付帯料金アイテム
   */
  async function enable(charge: ChargeItems): Promise<void> {
    if (charge.enabled) return
    const item = await masters.patch<ChargeItems>('Charges', charge.id, {
      _etag: charge._etag,
      enabled: true,
      isActive: true,
    })
    store.items.value.set(item.id, item)
  }

  /**
   * 利用フラグを切り替える。
   * @param charge - 対象の付帯料金アイテム
   */
  async function toggleActive(charge: ChargeItems): Promise<void> {
    const item = await masters.patch<ChargeItems>('Charges', charge.id, {
      _etag: charge._etag,
      isActive: !charge.isActive,
    })
    store.items.value.set(item.id, item)
  }

  return { ...store, enable, toggleActive } satisfies MasterStore & { enable: typeof enable, toggleActive: typeof toggleActive }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useChargesStore, import.meta.hot))
}
