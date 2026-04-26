import type { QTableProps } from 'quasar'
import type { MasterStore } from 'stores/masters'
import { useForwardersStore } from 'stores/masters/forwarders'
import { resolveIcon } from 'src/composables/use-icon'

export const useStore = (): MasterStore => useForwardersStore()
export const meta = {
  titleKey: 'navi.masters-container.forwarders',
  icon: resolveIcon('masters-container.forwarders'),
}

export const columns: QTableProps['columns'] = [
  { name: 'prefecture', label: 'containers.fields.prefecture', field: 'prefecture', align: 'left' },
  { name: 'city', label: 'containers.fields.city', field: 'city', align: 'left' },
  { name: 'notes', label: 'containers.fields.notes', field: 'notes', align: 'left' },
  { name: 'actions', label: '', field: 'actions', align: 'center', sortable: false },
]
