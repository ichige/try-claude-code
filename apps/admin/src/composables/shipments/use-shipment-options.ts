import { computed } from 'vue'
import { useConsignorsStore } from 'stores/masters/consignors'
import { useConsigneesStore } from 'stores/masters/consignees'
import { useForwardersStore } from 'stores/masters/forwarders'

/**
 * @returns 出荷登録フォームで使うマスタ選択肢を提供するコンポーザブル
 */
export function useShipmentOptions() {
  const consignorsStore = useConsignorsStore()
  const consigneesStore = useConsigneesStore()
  const forwardersStore = useForwardersStore()

  /** 取引先選択肢 */
  const consignorOptions = computed(() =>
    consignorsStore.list.map((c) => ({ label: c.companyName, value: c.id })),
  )

  /** 納品先選択肢 */
  const consigneeOptions = computed(() =>
    consigneesStore.list.map((c) => ({ label: c.companyName, value: c.companyName })),
  )

  /** 地点選択肢 */
  const forwarderOptions = computed(() =>
    forwardersStore.list.map((f) => ({ label: `${f.prefecture} ${f.city}`, value: f.city })),
  )

  return { consignorOptions, consigneeOptions, forwarderOptions }
}
