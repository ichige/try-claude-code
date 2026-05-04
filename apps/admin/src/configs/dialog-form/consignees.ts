import { h } from 'vue'
import { QInput, QIcon } from 'quasar'
import { z } from 'zod'
import { zodRule } from 'src/utils/zod-rule'
import type { MasterStore } from 'stores/masters'
import { useConsigneesStore } from 'stores/masters/consignees'
import { resolveIcon } from 'src/composables/use-icon'
import { i18n } from 'src/boot/i18n'
import type { DialogFormSection } from './types'

const { t } = i18n.global

/**
 * この設定に依存する Store を返す
 */
export const label = t('navi.masters-container.consignees')

/**
 * 入力値のスキーマ
 */
export const schema = z.object({
  companyName: z.string().min(1, t('validation.required', { field: t('containers.fields.companyName') })),
  companyCode: z.string().default(''),
  invoiceNumber: z.string().default(''),
  postalCode: z.string().default(''),
  prefecture: z.string().default(''),
  cityStreet: z.string().default(''),
  building: z.string().default(''),
  phone: z.string().default(''),
  email: z.string().default(''),
  website: z.string().default(''),
  notes: z.string().default(''),
})

/**
 * 入力値の初期値
 */
export const initialForm: Record<string, string | number | boolean> = {
  companyName: '',
  companyCode: '',
  invoiceNumber: '',
  postalCode: '',
  prefecture: '',
  cityStreet: '',
  building: '',
  phone: '',
  email: '',
  website: '',
  notes: '',
}

/**
 * この設定に依存する Store を返す
 */
export const useStore = (): MasterStore => useConsigneesStore()

/**
 * form を閉じ込めた render 関数を持つ DialogFormItem 配列を生成する。
 * @param form - リアクティブなフォームオブジェクト
 */
export function buildItems(form: Record<string, string | number | boolean | null>): DialogFormSection[] {
  const upd = (key: string) => (v: string | number | null) => { form[key] = v ?? '' }

  return [
    {
      header: { icon: resolveIcon('basic'), label: t('labels.basic') },
      fields: [
        {
          col: 'col-6',
          component: () => h(QInput, {
            modelValue: form['companyName'], 'onUpdate:modelValue': upd('companyName'),
            label: t('containers.fields.companyName'), outlined: true, dense: true,
            rules: [zodRule(schema.shape['companyName'] as z.ZodType)],
          }, { prepend: () => h(QIcon, { name: resolveIcon('companyName'), size: 'xs' }) }),
        },
        {
          col: 'col-6',
          component: () => h(QInput, {
            modelValue: form['companyCode'], 'onUpdate:modelValue': upd('companyCode'),
            label: t('containers.fields.companyCode'), outlined: true, dense: true,
          }, { prepend: () => h(QIcon, { name: resolveIcon('companyCode'), size: 'xs' }) }),
        },
        {
          col: 'col-6',
          component: () => h(QInput, {
            modelValue: form['invoiceNumber'], 'onUpdate:modelValue': upd('invoiceNumber'),
            label: t('containers.fields.invoiceNumber'), outlined: true, dense: true,
          }, { prepend: () => h(QIcon, { name: resolveIcon('invoiceNumber'), size: 'xs' }) }),
        },
      ],
    },
    {
      header: { icon: resolveIcon('address'), label: t('labels.address') },
      fields: [
        {
          col: 'col-6',
          component: () => h(QInput, {
            modelValue: form['postalCode'], 'onUpdate:modelValue': upd('postalCode'),
            label: t('containers.fields.postalCode'), outlined: true, dense: true,
          }, { prepend: () => h(QIcon, { name: resolveIcon('postalCode'), size: 'xs' }) }),
        },
        {
          col: 'col-6',
          component: () => h(QInput, {
            modelValue: form['prefecture'], 'onUpdate:modelValue': upd('prefecture'),
            label: t('containers.fields.prefecture'), outlined: true, dense: true,
          }, { prepend: () => h(QIcon, { name: resolveIcon('prefecture'), size: 'xs' }) }),
        },
        {
          col: 'col-12',
          component: () => h(QInput, {
            modelValue: form['cityStreet'], 'onUpdate:modelValue': upd('cityStreet'),
            label: t('containers.fields.cityStreet'), outlined: true, dense: true,
          }, { prepend: () => h(QIcon, { name: resolveIcon('cityStreet'), size: 'xs' }) }),
        },
        {
          col: 'col-6',
          component: () => h(QInput, {
            modelValue: form['building'], 'onUpdate:modelValue': upd('building'),
            label: t('containers.fields.building'), outlined: true, dense: true,
          }, { prepend: () => h(QIcon, { name: resolveIcon('building'), size: 'xs' }) }),
        },
      ],
    },
    {
      header: { icon: resolveIcon('contact'), label: t('labels.contact') },
      fields: [
        {
          col: 'col-6',
          component: () => h(QInput, {
            modelValue: form['phone'], 'onUpdate:modelValue': upd('phone'),
            label: t('containers.fields.phone'), outlined: true, dense: true,
          }, { prepend: () => h(QIcon, { name: resolveIcon('phone'), size: 'xs' }) }),
        },
        {
          col: 'col-6',
          component: () => h(QInput, {
            modelValue: form['email'], 'onUpdate:modelValue': upd('email'),
            label: t('containers.fields.email'), outlined: true, dense: true,
          }, { prepend: () => h(QIcon, { name: resolveIcon('email'), size: 'xs' }) }),
        },
        {
          col: 'col-12',
          component: () => h(QInput, {
            modelValue: form['website'], 'onUpdate:modelValue': upd('website'),
            label: t('containers.fields.website'), outlined: true, dense: true,
          }, { prepend: () => h(QIcon, { name: resolveIcon('website'), size: 'xs' }) }),
        },
      ],
    },
    {
      header: { icon: resolveIcon('other'), label: t('labels.other') },
      fields: [
        {
          col: 'col-12',
          component: () => h(QInput, {
            modelValue: form['notes'], 'onUpdate:modelValue': upd('notes'),
            label: t('containers.fields.notes'), type: 'textarea', outlined: true, dense: true, rows: '3',
          }),
        },
      ],
    },
  ]
}
