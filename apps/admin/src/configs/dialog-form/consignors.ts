import { h } from 'vue'
import { QInput, QIcon } from 'quasar'
import { z } from 'zod'
import { zodRule } from 'src/utils/zod-rule'
import type { MasterStore } from 'stores/masters'
import { useConsignorsStore } from 'stores/masters/consignors'
import { i18n } from 'src/boot/i18n'
import type { DialogFormSection } from './types'

const { t } = i18n.global

export const label = t('navi.masters-container.consignors')

/**
 * 入力値のスキーマ
 */
export const schema = z.object({
  companyName: z.string().min(1, t('validation.required')),
  companyCode: z.string().default(''),
  invoiceNumber: z.string().default(''),
  paymentRate: z.coerce.number({ error: t('validation.numeric') }),
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
  paymentRate: 85,
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
export const useStore = (): MasterStore => useConsignorsStore()

/**
 * form を閉じ込めた render 関数を持つ DialogFormItem 配列を生成する。
 * @param form - リアクティブなフォームオブジェクト
 */
export function buildItems(form: Record<string, string | number | boolean | null>): DialogFormSection[] {
  const upd = (key: string) => (v: string | number | null) => { form[key] = v ?? '' }

  return [
    {
      header: { icon: 'sym_o_domain', label: '基本情報' },
      fields: [
        {
          col: 'col-6',
          component: () => h(QInput, {
            modelValue: form['companyName'], 'onUpdate:modelValue': upd('companyName'),
            label: t('containers.fields.companyName'), outlined: true, dense: true,
            rules: [zodRule(schema.shape['companyName'] as z.ZodType, t('containers.fields.companyName'))],
          }, { prepend: () => h(QIcon, { name: 'sym_o_domain', size: 'xs' }) }),
        },
        {
          col: 'col-6',
          component: () => h(QInput, {
            modelValue: form['companyCode'], 'onUpdate:modelValue': upd('companyCode'),
            label: t('containers.fields.companyCode'), outlined: true, dense: true,
          }, { prepend: () => h(QIcon, { name: 'sym_o_settings_ethernet', size: 'xs' }) }),
        },
        {
          col: 'col-6',
          component: () => h(QInput, {
            modelValue: form['invoiceNumber'], 'onUpdate:modelValue': upd('invoiceNumber'),
            label: t('containers.fields.invoiceNumber'), outlined: true, dense: true,
          }, { prepend: () => h(QIcon, { name: 'sym_o_tag', size: 'xs' }) }),
        },
        {
          col: 'col-6',
          component: () => h(QInput, {
            modelValue: form['paymentRate'], 'onUpdate:modelValue': upd('paymentRate'),
            label: t('containers.fields.paymentRate'), type: 'number', inputClass: 'text-right', outlined: true, dense: true,
            rules: [zodRule(schema.shape['paymentRate'] as z.ZodType, t('containers.fields.paymentRate'))],
          }, { prepend: () => h(QIcon, { name: 'sym_o_percent', size: 'xs' }) }),
        },
      ],
    },
    {
      header: { icon: 'sym_o_location_on', label: '所在地' },
      fields: [
        {
          col: 'col-6',
          component: () => h(QInput, {
            modelValue: form['postalCode'], 'onUpdate:modelValue': upd('postalCode'),
            label: t('containers.fields.postalCode'), outlined: true, dense: true,
          }, { prepend: () => h(QIcon, { name: 'sym_o_local_post_office', size: 'xs' }) }),
        },
        {
          col: 'col-6',
          component: () => h(QInput, {
            modelValue: form['prefecture'], 'onUpdate:modelValue': upd('prefecture'),
            label: t('containers.fields.prefecture'), outlined: true, dense: true,
          }, { prepend: () => h(QIcon, { name: 'sym_o_map', size: 'xs' }) }),
        },
        {
          col: 'col-12',
          component: () => h(QInput, {
            modelValue: form['cityStreet'], 'onUpdate:modelValue': upd('cityStreet'),
            label: t('containers.fields.cityStreet'), outlined: true, dense: true,
          }, { prepend: () => h(QIcon, { name: 'sym_o_location_home', size: 'xs' }) }),
        },
        {
          col: 'col-6',
          component: () => h(QInput, {
            modelValue: form['building'], 'onUpdate:modelValue': upd('building'),
            label: t('containers.fields.building'), outlined: true, dense: true,
          }, { prepend: () => h(QIcon, { name: 'sym_o_apartment', size: 'xs' }) }),
        },
      ],
    },
    {
      header: { icon: 'sym_o_id_card', label: '連絡先' },
      fields: [
        {
          col: 'col-6',
          component: () => h(QInput, {
            modelValue: form['phone'], 'onUpdate:modelValue': upd('phone'),
            label: t('containers.fields.phone'), outlined: true, dense: true,
          }, { prepend: () => h(QIcon, { name: 'sym_o_phone', size: 'xs' }) }),
        },
        {
          col: 'col-6',
          component: () => h(QInput, {
            modelValue: form['email'], 'onUpdate:modelValue': upd('email'),
            label: t('containers.fields.email'), outlined: true, dense: true,
          }, { prepend: () => h(QIcon, { name: 'sym_o_email', size: 'xs' }) }),
        },
        {
          col: 'col-12',
          component: () => h(QInput, {
            modelValue: form['website'], 'onUpdate:modelValue': upd('website'),
            label: t('containers.fields.website'), outlined: true, dense: true,
          }, { prepend: () => h(QIcon, { name: 'sym_o_language', size: 'xs' }) }),
        },
      ],
    },
    {
      header: { icon: 'sym_o_notes', label: 'その他' },
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
