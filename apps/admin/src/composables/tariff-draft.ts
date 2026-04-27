import type { InjectionKey } from 'vue'
import type { TariffsItem } from '@shisamo/shared'

export type TariffDraft = Pick<TariffsItem, 'name' | 'notes' | 'ranges'>

export const tariffDraftKey: InjectionKey<TariffDraft> = Symbol('tariffDraft')
