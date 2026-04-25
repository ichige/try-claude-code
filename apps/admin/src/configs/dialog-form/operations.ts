export type Operation = 'create' | 'update'

export const operationConfigs = {
  create: {
    label: 'labels.create',
    color: 'positive',
    icon: 'add',
    size: 'sm',
    unelevated: true,
  },
  update: {
    label: 'labels.update',
    color: 'warning',
    icon: 'edit',
    size: 'sm',
    unelevated: true,
  },
} as const satisfies Record<Operation, object>

export type OperationConfigs = typeof operationConfigs
