import { defineStore, acceptHMRUpdate } from 'pinia'
import type { TariffsItem } from '@shisamo/shared'
import { useMastersStore, type MasterStore } from 'stores/masters'
import { createMasterStore } from './factory'

/**
 * 運賃マスタのストア
 */
export const useTariffsStore = defineStore('masters/tariffs', () => {
  const masters = useMastersStore()
  const store = createMasterStore<TariffsItem>('Tariffs')

  /**
   * 運用開始フラグを有効化する。一度 true にすると以後変更不可。
   * @param tariff - 対象の運賃表アイテム
   */
  async function enable(tariff: TariffsItem): Promise<void> {
    if (tariff.enabled) return
    const item = await masters.patch<TariffsItem>('Tariffs', tariff.id, {
      _etag: tariff._etag,
      enabled: true,
    })
    store.items.value.set(item.id, item)
  }

  return { ...store, enable } satisfies MasterStore & { enable: typeof enable }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useTariffsStore, import.meta.hot))
}
