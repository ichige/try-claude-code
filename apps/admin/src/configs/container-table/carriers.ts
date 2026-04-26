import type { QTableProps } from 'quasar'
import type { MasterStore } from 'stores/masters'
import { useCarriersStore } from 'stores/masters/carriers'
import { resolveIcon } from 'src/composables/use-icon'

export const useStore = (): MasterStore => useCarriersStore()
export const meta = {
  titleKey: 'navi.masters-container.carriers',
  icon: resolveIcon('masters-container.carriers'),
}

export const columns: QTableProps['columns'] = [
  { name: 'companyName', label: 'containers.fields.companyName', field: 'companyName', align: 'left' },
  { name: 'companyCode', label: 'containers.fields.companyCode', field: 'companyCode', align: 'left' },
  { name: 'invoiceNumber', label: 'containers.fields.invoiceNumber', field: 'invoiceNumber', align: 'left' },
  { name: 'lineId', label: 'containers.fields.lineId', field: 'lineId', align: 'left' },
  { name: 'postalCode', label: 'containers.fields.postalCode', field: 'postalCode', align: 'left' },
  { name: 'prefecture', label: 'containers.fields.prefecture', field: 'prefecture', align: 'left' },
  { name: 'cityStreet', label: 'containers.fields.cityStreet', field: 'cityStreet', align: 'left' },
  { name: 'building', label: 'containers.fields.building', field: 'building', align: 'left' },
  { name: 'phone', label: 'containers.fields.phone', field: 'phone', align: 'left' },
  { name: 'email', label: 'containers.fields.email', field: 'email', align: 'left' },
  { name: 'notes', label: 'containers.fields.notes', field: 'notes', align: 'left' },
  { name: 'actions', label: '', field: 'actions', align: 'center', sortable: false },
]
