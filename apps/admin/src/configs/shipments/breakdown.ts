import type { ShipmentBreakdownCode } from '@shisamo/shared'
import { PRESET_ITEMS } from 'src/configs/masters/charges'

export interface BreakdownDef {
  code: ShipmentBreakdownCode
  label: string
  suffix: string
}


const unitSuffix = (unit: string): string => {
  if (unit === 'minutes') return '分'
  if (unit === 'count') return '件'
  return '円'
}

export const BREAKDOWN_DEFS: BreakdownDef[] = [
  { code: 'distance', label: '走行距離', suffix: 'km' },
  ...PRESET_ITEMS.map((item) => ({
    code: item.code,
    label: item.label,
    suffix: unitSuffix(item.unit),
  })),
]
