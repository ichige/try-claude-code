import { i18n } from 'src/boot/i18n'

export type Operation = 'create' | 'update'

export const operationConfigs = {
  create: {
    label: i18n.global.t('labels.create'),
    color: 'positive',
    icon: 'add',
    size: 'sm',
    unelevated: true,
  },
  update: {
    label: i18n.global.t('labels.update'),
    color: 'warning',
    icon: 'edit',
    size: 'sm',
    unelevated: true,
  },
} as const satisfies Record<Operation, object>

export type OperationConfigs = typeof operationConfigs
