import { h } from 'vue'
import { QInput, QIcon } from 'quasar'
import { z } from 'zod'
import { zodRule } from 'src/utils/zod-rule'
import type { MasterStore } from 'stores/masters'
import { useForwardersStore } from 'stores/masters/forwarders'
import { resolveIcon } from 'src/composables/use-icon'
import { i18n } from 'src/boot/i18n'
import type { DialogFormSection } from './types'

const { t } = i18n.global

export const label = t('navi.masters-container.forwarders')

/**
 * 入力値のスキーマ検証
 */
const ml = (field: string, max: number) => t('validation.maxLength', { field, max })
const f = (key: string) => t(`containers.fields.${key}`)

export const schema = z.object({
  prefecture: z.string().min(1, t('validation.required', { field: f('prefecture') })).max(16, ml(f('prefecture'), 16)),
  city:       z.string().min(1, t('validation.required', { field: f('city') })).max(80, ml(f('city'), 80)),
  notes:      z.string().max(1024, ml(f('notes'), 1024)).default(''),
})

/**
 * 入力値の初期値
 */
export const initialForm: Record<string, string | number | boolean> = {
  prefecture: '',
  city: '',
  notes: '',
}

/**
 * この設定に依存する Store を返す
 */
export const useStore = (): MasterStore => useForwardersStore()

/**
 * form を閉じ込めた render 関数を持つ DialogFormItem 配列を生成する。
 * @param form - リアクティブなフォームオブジェクト
 */
export function buildItems(form: Record<string, string | number | boolean | null>): DialogFormSection[] {
  const upd = (key: string) => (v: string | number | boolean | null) => { form[key] = v ?? '' }

  return [
    {
      header: { icon: resolveIcon('address'), label: t('labels.address') },
      fields: [
        {
          col: 'col-6',
          component: () => h(QInput, {
            modelValue: form['prefecture'], 'onUpdate:modelValue': upd('prefecture'),
            label: t('containers.fields.prefecture'), outlined: true, dense: true,
            maxlength: '16', rules: [zodRule(schema.shape['prefecture'] as z.ZodType)],
          }, { prepend: () => h(QIcon, { name: resolveIcon('prefecture'), size: 'xs' }) }),
        },
        {
          col: 'col-6',
          component: () => h(QInput, {
            modelValue: form['city'], 'onUpdate:modelValue': upd('city'),
            label: t('containers.fields.city'), outlined: true, dense: true,
            maxlength: '80', rules: [zodRule(schema.shape['city'] as z.ZodType)],
          }, { prepend: () => h(QIcon, { name: resolveIcon('city'), size: 'xs' }) }),
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
