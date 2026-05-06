import { h } from 'vue'
import { QInput, QIcon } from 'quasar'
import { z } from 'zod'
import { zodRule } from 'src/utils/zod-rule'
import type { MasterStore } from 'stores/masters'
import { useCarriersStore } from 'stores/masters/carriers'
import { resolveIcon } from 'src/composables/use-icon'
import { i18n } from 'src/boot/i18n'
import type { DialogFormSection } from './types'

const { t } = i18n.global

export const label = t('navi.masters-container.carriers')

/**
 * 入力値のスキーマ検証
 */
const ml = (field: string, max: number) => t('validation.maxLength', { field, max })
const f = (key: string) => t(`containers.fields.${key}`)

export const schema = z.object({
  companyName:   z.string().min(1, t('validation.required', { field: f('companyName') })).max(80, ml(f('companyName'), 80)),
  companyCode:   z.string().max(80, ml(f('companyCode'), 80)).regex(/^[a-zA-Z0-9_-]*$/, t('validation.format.companyCode')).default(''),
  invoiceNumber: z.string().refine((v) => v === '' || /^T\d{13}$/.test(v), t('validation.format.invoiceNumber')).default(''),
  lineId:        z.string().default(''),
  postalCode:    z.string().refine((v) => v === '' || /^\d{3}-\d{4}$/.test(v), t('validation.format.postalCode')).default(''),
  prefecture:    z.string().max(16, ml(f('prefecture'), 16)).default(''),
  cityStreet:    z.string().max(256, ml(f('cityStreet'), 256)).default(''),
  building:      z.string().max(128, ml(f('building'), 128)).default(''),
  phone:         z.string().max(16, ml(f('phone'), 16)).regex(/^[\d-]*$/, t('validation.format.phone')).default(''),
  email:         z.string().refine((v) => v === '' || z.string().email().safeParse(v).success, t('validation.format.email')).default(''),
  notes:         z.string().max(1024, ml(f('notes'), 1024)).default(''),
})

/**
 * 入力値の初期値
 */
export const initialForm: Record<string, string | number | boolean> = {
  companyName: '',
  companyCode: '',
  invoiceNumber: '',
  lineId: '',
  postalCode: '',
  prefecture: '',
  cityStreet: '',
  building: '',
  phone: '',
  email: '',
  notes: '',
}

/**
 * この設定に依存する Store を返す
 */
export const useStore = (): MasterStore => useCarriersStore()

/**
 * form を閉じ込めた render 関数を持つ DialogFormItem 配列を生成する。
 * @param form - リアクティブなフォームオブジェクト
 */
export function buildItems(form: Record<string, string | number | boolean | null>): DialogFormSection[] {
  const upd = (key: string) => (v: string | number | boolean | null) => { form[key] = v ?? '' }

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
            maxlength: '80', rules: [zodRule(schema.shape['companyCode'] as z.ZodType)],
          }, { prepend: () => h(QIcon, { name: resolveIcon('companyCode'), size: 'xs' }) }),
        },
        {
          col: 'col-6',
          component: () => h(QInput, {
            modelValue: form['invoiceNumber'], 'onUpdate:modelValue': upd('invoiceNumber'),
            label: t('containers.fields.invoiceNumber'), outlined: true, dense: true,
            maxlength: '14', rules: [zodRule(schema.shape['invoiceNumber'] as z.ZodType)],
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
            maxlength: '8', rules: [zodRule(schema.shape['postalCode'] as z.ZodType)],
          }, { prepend: () => h(QIcon, { name: resolveIcon('postalCode'), size: 'xs' }) }),
        },
        {
          col: 'col-6',
          component: () => h(QInput, {
            modelValue: form['prefecture'], 'onUpdate:modelValue': upd('prefecture'),
            label: t('containers.fields.prefecture'), outlined: true, dense: true,
            maxlength: '16', rules: [zodRule(schema.shape['prefecture'] as z.ZodType)],
          }, { prepend: () => h(QIcon, { name: resolveIcon('prefecture'), size: 'xs' }) }),
        },
        {
          col: 'col-12',
          component: () => h(QInput, {
            modelValue: form['cityStreet'], 'onUpdate:modelValue': upd('cityStreet'),
            label: t('containers.fields.cityStreet'), outlined: true, dense: true,
            maxlength: '256', rules: [zodRule(schema.shape['cityStreet'] as z.ZodType)],
          }, { prepend: () => h(QIcon, { name: resolveIcon('cityStreet'), size: 'xs' }) }),
        },
        {
          col: 'col-6',
          component: () => h(QInput, {
            modelValue: form['building'], 'onUpdate:modelValue': upd('building'),
            label: t('containers.fields.building'), outlined: true, dense: true,
            maxlength: '128', rules: [zodRule(schema.shape['building'] as z.ZodType)],
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
            maxlength: '16', rules: [zodRule(schema.shape['phone'] as z.ZodType)],
          }, { prepend: () => h(QIcon, { name: resolveIcon('phone'), size: 'xs' }) }),
        },
        {
          col: 'col-6',
          component: () => h(QInput, {
            modelValue: form['email'], 'onUpdate:modelValue': upd('email'),
            label: t('containers.fields.email'), outlined: true, dense: true,
            rules: [zodRule(schema.shape['email'] as z.ZodType)],
          }, { prepend: () => h(QIcon, { name: resolveIcon('email'), size: 'xs' }) }),
        },
        {
          col: 'col-6',
          component: () => h(QInput, {
            modelValue: form['lineId'], 'onUpdate:modelValue': upd('lineId'),
            label: t('containers.fields.lineId'), outlined: true, dense: true,
          }, { prepend: () => h(QIcon, { name: resolveIcon('lineId'), size: 'xs' }) }),
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
            maxlength: '1024', rules: [zodRule(schema.shape['notes'] as z.ZodType)],
          }),
        },
      ],
    },
  ]
}
