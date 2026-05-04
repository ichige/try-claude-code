import type { InjectionKey, Ref } from 'vue'
import type { ShipmentsItem } from '@shisamo/shared'

/**
 * pk はクライアントで設定するため除外しない。
 * id・_etag・タイムスタンプ・論理削除フラグは作成前は存在しないため optional とする。
 * 作成・更新後はサーバー返却値をそのまま保持する。
 */
export type ShipmentDraft = Omit<ShipmentsItem, 'id' | '_etag' | 'createdAt' | 'updatedAt' | 'deletedAt' | 'isDeleted'>
  & {
    id?: string
    _etag?: string
    createdAt?: string
    updatedAt?: string
    deletedAt?: string | null
    isDeleted?: boolean
  }

export const shipmentDraftKey: InjectionKey<Ref<ShipmentDraft>> = Symbol('shipmentDraft')
export const shipmentStepKey: InjectionKey<Ref<number>> = Symbol('shipmentStep')
