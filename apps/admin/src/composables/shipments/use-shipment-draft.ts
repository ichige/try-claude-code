import { useAppStore } from 'stores/app'
import type { ShipmentDraft } from 'components/shipments/shipment-draft'
import { BREAKDOWN_DEFS } from 'src/configs/shipments/breakdown'

/**
 * @returns ShipmentDraft の初期値を生成するファクトリを提供するコンポーザブル
 */
export function useShipmentDraft() {
  const appStore = useAppStore()

  /**
   * @returns 処理月を pk にセットした初期 draft
   */
  function initialDraft(): ShipmentDraft {
    return {
      pk: appStore.processingMonth,
      consignorId: '',
      deliveryDate: '',
      origin: '',
      originAddress: '',
      destination: '',
      destinationAddress: '',
      carrierId: null,
      breakdown: BREAKDOWN_DEFS.map((def) => ({ code: def.code, quantity: 0 })),
      invoice: null,
      details: null,
      notes: '',
    }
  }

  return { initialDraft }
}
