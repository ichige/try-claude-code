import type { QTableProps } from 'quasar'
import type { MasterStore } from 'stores/masters'
import { useCarriersStore } from 'stores/masters/carriers'
import { resolveIcon } from 'src/composables/use-icon'
import { i18n } from 'src/boot/i18n'

const { t } = i18n.global

export const useStore = (): MasterStore => useCarriersStore()
export const meta = {
  titleKey: 'navi.masters-container.carriers',
  icon: resolveIcon('masters-container.carriers'),
}

export const columns: QTableProps['columns'] = [
  { name: 'companyName', label: t('containers.fields.companyName'), field: 'companyName', align: 'left' },
  { name: 'companyCode', label: t('containers.fields.companyCode'), field: 'companyCode', align: 'left' },
  { name: 'invoiceNumber', label: t('containers.fields.invoiceNumber'), field: 'invoiceNumber', align: 'left' },
  { name: 'lineId', label: t('containers.fields.lineId'), field: 'lineId', align: 'left' },
  { name: 'postalCode', label: t('containers.fields.postalCode'), field: 'postalCode', align: 'left' },
  { name: 'prefecture', label: t('containers.fields.prefecture'), field: 'prefecture', align: 'left' },
  { name: 'cityStreet', label: t('containers.fields.cityStreet'), field: 'cityStreet', align: 'left' },
  { name: 'building', label: t('containers.fields.building'), field: 'building', align: 'left' },
  { name: 'phone', label: t('containers.fields.phone'), field: 'phone', align: 'left' },
  { name: 'email', label: t('containers.fields.email'), field: 'email', align: 'left' },
  { name: 'notes', label: t('containers.fields.notes'), field: 'notes', align: 'left' },
  { name: 'actions', label: '', field: 'actions', align: 'center', sortable: false },
]
