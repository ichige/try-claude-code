import type { InjectionKey, Ref } from 'vue'
import type { ShipmentsItem } from '@shisamo/shared'

/**
 * pk はクライアントで設定するため除外しない。
 * id・_etag は作成後にサーバーから返却されるため optional で保持する。
 * タイムスタンプ・論理削除フラグはクライアントで不要なため除外。
 */
export type ShipmentDraft = Omit<ShipmentsItem, 'id' | '_etag' | 'createdAt' | 'updatedAt' | 'deletedAt' | 'isDeleted'>
  & { id?: string; _etag?: string }

export const shipmentDraftKey: InjectionKey<Ref<ShipmentDraft>> = Symbol('shipmentDraft')
export const shipmentStepKey: InjectionKey<Ref<number>> = Symbol('shipmentStep')
