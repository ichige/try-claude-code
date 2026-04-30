import type { QTableProps } from 'quasar'
import type { ChargeItem } from '@shisamo/shared'
import { i18n } from 'src/boot/i18n'

const { t } = i18n.global

export const columns: QTableProps['columns'] = [
  { name: 'code',     label: t('charges.fields.code'),     field: 'code',     align: 'left'   },
  { name: 'label',    label: t('charges.fields.label'),    field: 'label',    align: 'left'   },
  { name: 'unit',     label: t('charges.fields.unit'),     field: 'unit',     align: 'left'   },
  { name: 'taxable',  label: t('charges.fields.taxable'),  field: 'taxable',  align: 'center' },
  { name: 'baseUnit', label: t('charges.fields.baseUnit'), field: 'baseUnit', align: 'right'  },
  { name: 'minUnit',  label: t('charges.fields.minUnit'),  field: 'minUnit',  align: 'right'  },
  { name: 'unitFare', label: t('charges.fields.unitFare'), field: 'unitFare', align: 'right'  },
  { name: 'notes',    label: t('charges.fields.notes'),    field: 'notes',    align: 'left'   },
  { name: 'calc',     label: t('charges.fields.calc'),     field: () => '',   align: 'right'  },
]

export const PRESET_ITEMS: ChargeItem[] = [
  { code: 'delivery-count', label: '配送件数',    unit: 'count',   taxable: true,  baseUnit: 1,  minUnit: 4, unitFare: 300, notes: '配送件数は4件から300円ずつ課金されます。' },
  { code: 'highway-fee',    label: '高速料金',    unit: 'yen',     taxable: false, baseUnit: 1,  minUnit: 1, unitFare: 1,   notes: '高速料金は非課税です。' },
  { code: 'waiting-time',   label: '待機時間',    unit: 'minutes', taxable: true,  baseUnit: 15, minUnit: 1, unitFare: 750, notes: '待機料金は15分単位で課金されます。' },
  { code: 'working-time',   label: '作業時間',    unit: 'minutes', taxable: true,  baseUnit: 15, minUnit: 1, unitFare: 750, notes: '作業料金は15分単位で課金されます。' },
  { code: 'parking-fee',    label: '駐車料金',    unit: 'yen',     taxable: false, baseUnit: 1,  minUnit: 1, unitFare: 1,   notes: '駐車料金は非課税です。' },
  { code: 'cancel-fee',     label: 'キャンセル料金', unit: 'yen',  taxable: true,  baseUnit: 1,  minUnit: 1, unitFare: 1,   notes: '稀にキャンセル料金が発生する場合があります。' },
  { code: 'flat-rate-fee',  label: '定額料金',    unit: 'yen',     taxable: true,  baseUnit: 1,  minUnit: 1, unitFare: 1,   notes: '定期的な配送などは、定額になる場合があります。' },
  { code: 'other-fee1',     label: 'その他',      unit: 'yen',     taxable: true,  baseUnit: 1,  minUnit: 1, unitFare: 1,   notes: 'その他例外的な料金です。' },
  { code: 'other-fee2',     label: 'その他',      unit: 'yen',     taxable: false, baseUnit: 1,  minUnit: 1, unitFare: 1,   notes: 'その他例外的な料金(非課税)です。' },
]
