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
export const schema = z.object({
  prefecture: z.string().min(1, t('validation.required')),
  city: z.string().min(1, t('validation.required')),
  notes: z.string().default(''),
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
            rules: [zodRule(schema.shape['prefecture'] as z.ZodType, t('containers.fields.prefecture'))],
          }, { prepend: () => h(QIcon, { name: resolveIcon('prefecture'), size: 'xs' }) }),
        },
        {
          col: 'col-6',
          component: () => h(QInput, {
            modelValue: form['city'], 'onUpdate:modelValue': upd('city'),
            label: t('containers.fields.city'), outlined: true, dense: true,
            rules: [zodRule(schema.shape['city'] as z.ZodType, t('containers.fields.city'))],
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
          }),
        },
      ],
    },
  ]
}
