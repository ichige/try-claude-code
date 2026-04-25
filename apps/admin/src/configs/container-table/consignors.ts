import type { QTableProps } from 'quasar'
import type { MasterStore } from 'stores/masters'
import { useConsignorsStore } from 'stores/masters/consignors'
import { resolveIcon } from 'src/composables/use-icon'

export const useStore = (): MasterStore => useConsignorsStore()
export const meta = {
  titleKey: 'navi.masters-container.consignors',
  icon: resolveIcon('masters-container.consignors'),
}

export const columns: QTableProps['columns'] = [
  { name: 'companyName', label: 'containers.fields.companyName', field: 'companyName', align: 'left' },
  { name: 'companyCode', label: 'containers.fields.companyCode', field: 'companyCode', align: 'left' },
  { name: 'invoiceNumber', label: 'containers.fields.invoiceNumber', field: 'invoiceNumber', align: 'left' },
  { name: 'paymentRate', label: 'containers.fields.paymentRate', field: 'paymentRate', align: 'right' },
  { name: 'postalCode', label: 'containers.fields.postalCode', field: 'postalCode', align: 'left' },
  { name: 'prefecture', label: 'containers.fields.prefecture', field: 'prefecture', align: 'left' },
  { name: 'cityStreet', label: 'containers.fields.cityStreet', field: 'cityStreet', align: 'left' },
  { name: 'building', label: 'containers.fields.building', field: 'building', align: 'left' },
  { name: 'phone', label: 'containers.fields.phone', field: 'phone', align: 'left' },
  { name: 'email', label: 'containers.fields.email', field: 'email', align: 'left' },
  { name: 'website', label: 'containers.fields.website', field: 'website', align: 'left' },
  { name: 'notes', label: 'containers.fields.notes', field: 'notes', align: 'left' },
  { name: 'actions', label: '', field: 'actions', align: 'center', sortable: false },
]
