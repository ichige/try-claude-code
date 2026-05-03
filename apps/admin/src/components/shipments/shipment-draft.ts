import type { InjectionKey, Ref } from 'vue'
import type { CosmosItem, ShipmentsItem } from '@shisamo/shared'

export type ShipmentDraft = Omit<ShipmentsItem, keyof CosmosItem>

export const shipmentDraftKey: InjectionKey<Ref<ShipmentDraft>> = Symbol('shipmentDraft')
export const shipmentStepKey: InjectionKey<Ref<number>> = Symbol('shipmentStep')
