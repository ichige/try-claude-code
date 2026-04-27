import type { InjectionKey, Ref } from 'vue'
import type { TariffsItem } from '@shisamo/shared'

export type TariffDraft = Pick<TariffsItem, 'name' | 'notes' | 'ranges'>

export const tariffDraftKey: InjectionKey<TariffDraft> = Symbol('tariffDraft')
export const tariffStepKey: InjectionKey<Ref<number>> = Symbol('tariffStep')
export const tariffVersionKey: InjectionKey<Ref<number>> = Symbol('tariffVersion')
