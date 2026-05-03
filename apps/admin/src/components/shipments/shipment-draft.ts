import type { InjectionKey, Ref } from 'vue'
import type { ShipmentsItem } from '@shisamo/shared'

/** pk はクライアントで設定するため除外しない。id・タイムスタンプ・_etag はサーバー生成のため除外。 */
export type ShipmentDraft = Omit<ShipmentsItem, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt' | 'isDeleted' | '_etag'>

export const shipmentDraftKey: InjectionKey<Ref<ShipmentDraft>> = Symbol('shipmentDraft')
export const shipmentStepKey: InjectionKey<Ref<number>> = Symbol('shipmentStep')
