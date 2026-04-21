export type Operation = 'create' | 'update'

export const operationConfigs = {
  create: {
    label: '登録',
    color: 'positive',
    icon: 'add',
    size: 'md',
    unelevated: true,
  },
  update: {
    label: '更新',
    color: 'warning',
    icon: 'edit',
    size: 'md',
    unelevated: true,
  },
} as const satisfies Record<Operation, object>
