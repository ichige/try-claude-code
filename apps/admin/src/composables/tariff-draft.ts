import type { InjectionKey, Ref } from 'vue'
import type { TariffsItem } from '@shisamo/shared'

export type TariffDraft = Pick<TariffsItem, 'name' | 'notes' | 'ranges'>

export const tariffDraftKey: InjectionKey<Ref<TariffDraft>> = Symbol('tariffDraft')
export const tariffStepKey: InjectionKey<Ref<number>> = Symbol('tariffStep')
export const tariffVersionKey: InjectionKey<Ref<number>> = Symbol('tariffVersion')

/**
 * 入力の初期値
 */
export const initialDraft = () => ({
  name: '',
  notes: '',
  ranges: [{ minKm: 1, maxKm: 20, baseFare: 0, unitKm: 1, unitFare: 0 }],
})
