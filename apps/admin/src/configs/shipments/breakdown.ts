import type { ShipmentBreakdownCode } from '@shisamo/shared'
import { PRESET_ITEMS } from 'src/configs/masters/charges'
import { i18n } from 'src/boot/i18n'

const { t } = i18n.global

export interface BreakdownDef {
  code: ShipmentBreakdownCode
  label: string
  suffix: string
  max: number
}

const MAX_BY_CODE: Record<ShipmentBreakdownCode, number> = {
  'distance':       3000,
  'delivery-count': 100,
  'highway-fee':    100000,
  'waiting-time':   1440,
  'working-time':   1440,
  'parking-fee':    100000,
  'cancel-fee':     200000,
  'flat-rate-fee':  200000,
  'other-fee1':     200000,
  'other-fee2':     200000,
}

const unitSuffix = (unit: string): string => {
  if (unit === 'minutes') return t('charges.unit.minutes')
  if (unit === 'count') return t('charges.unit.count')
  return t('charges.unit.yen')
}

export const BREAKDOWN_DEFS: BreakdownDef[] = [
  { code: 'distance', label: t('shipments.fields.distance'), suffix: 'km', max: MAX_BY_CODE['distance'] },
  ...PRESET_ITEMS.map((item) => ({
    code: item.code,
    label: item.label,
    suffix: unitSuffix(item.unit),
    max: MAX_BY_CODE[item.code],
  })),
]
