import type { QTableProps } from 'quasar'
import type { MasterStore } from 'stores/masters'
import { useForwardersStore } from 'stores/masters/forwarders'
import { resolveIcon } from 'src/composables/use-icon'
import { i18n } from 'src/boot/i18n'

const { t } = i18n.global

export const useStore = (): MasterStore => useForwardersStore()
export const meta = {
  titleKey: 'navi.masters-container.forwarders',
  icon: resolveIcon('masters-container.forwarders'),
}

export const columns: QTableProps['columns'] = [
  { name: 'prefecture', label: t('containers.fields.prefecture'), field: 'prefecture', align: 'left' },
  { name: 'city', label: t('containers.fields.city'), field: 'city', align: 'left' },
  { name: 'notes', label: t('containers.fields.notes'), field: 'notes', align: 'left' },
  { name: 'actions', label: '', field: 'actions', align: 'center', sortable: false },
]
