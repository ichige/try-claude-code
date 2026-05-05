import { useI18n } from 'vue-i18n'
import type { QTableProps } from 'quasar'
import type { ShipmentsItem } from '@shisamo/shared'
import { useConsignorsStore } from 'stores/masters/consignors'
import { useCarriersStore } from 'stores/masters/carriers'

/**
 * @returns ShipmentsPage の QTable カラム定義
 */
export function useShipmentsColumns() {
  const { t } = useI18n()
  const consignorsStore = useConsignorsStore()
  const carriersStore = useCarriersStore()

  const columns: QTableProps['columns'] = [
    {
      name: 'consignorName',
      label: t('shipments.fields.consignorId'),
      field: (row: ShipmentsItem) => consignorsStore.nameById(row.consignorId),
      align: 'left',
      sortable: true,
    },
    {
      name: 'deliveryDate',
      label: t('shipments.fields.deliveryDate'),
      field: 'deliveryDate',
      align: 'center',
      sortable: true,
    },
    {
      name: 'origin',
      label: t('shipments.fields.origin'),
      field: 'origin',
      align: 'left',
      sortable: true,
    },
    {
      name: 'destination',
      label: t('shipments.fields.destination'),
      field: 'destination',
      align: 'left',
      sortable: true,
    },
    {
      name: 'carrierName',
      label: t('shipments.fields.carrierId'),
      field: (row: ShipmentsItem) => carriersStore.nameById(row.carrierId),
      align: 'left',
      sortable: true,
    },
    {
      name: 'distance',
      label: t('shipments.fields.distance'),
      field: (row: ShipmentsItem) =>
        row.breakdown.find((b) => b.code === 'distance')?.quantity ?? null,
      align: 'right',
      sortable: true,
    },
    {
      name: 'notes',
      label: t('shipments.fields.notes'),
      field: 'notes',
      align: 'left',
    },
    { name: 'actions', label: '', field: 'id', align: 'center', sortable: false },
  ]

  return { columns }
}
