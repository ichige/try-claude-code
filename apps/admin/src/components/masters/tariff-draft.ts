import type { InjectionKey, Ref } from 'vue'
import type { TariffsItem } from '@shisamo/shared'

export type TariffDraft = Pick<TariffsItem, 'id' | 'name' | 'notes' | 'ranges' | 'enabled' | 'disabled'>

export const tariffDraftKey: InjectionKey<Ref<TariffDraft>> = Symbol('tariffDraft')
export const tariffStepKey: InjectionKey<Ref<number>> = Symbol('tariffStep')


