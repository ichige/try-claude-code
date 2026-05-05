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
    // 取引先名
    {
      name: 'consignorName',
      label: t('shipments.fields.consignorId'),
      field: (row: ShipmentsItem) => consignorsStore.nameById(row.consignorId),
      align: 'left',
      sortable: true,
    },
    // 配送日
    {
      name: 'deliveryDate',
      label: t('shipments.fields.deliveryDate'),
      field: 'deliveryDate',
      align: 'center',
      sortable: true,
    },
    // 発送地
    {
      name: 'origin',
      label: t('shipments.fields.origin'),
      field: 'origin',
      align: 'left',
      sortable: true,
    },
    // 納品先
    {
      name: 'destination',
      label: t('shipments.fields.destination'),
      field: 'destination',
      align: 'left',
      sortable: true,
    },
    // 配送業者名
    {
      name: 'carrierName',
      label: t('shipments.fields.carrierId'),
      field: (row: ShipmentsItem) => carriersStore.nameById(row.carrierId),
      align: 'left',
      sortable: true,
    },
    // 走行距離
    {
      name: 'distance',
      label: t('shipments.fields.distance'),
      field: (row: ShipmentsItem) =>
        row.breakdown.find((b) => b.code === 'distance')?.quantity ?? null,
      align: 'right',
      sortable: true,
    },
    // 取引ステータス
    {
      name: 'status',
      label: t('shipments.fields.status'),
      field: 'status',
      align: 'center',
      sortable: true,
    },
    // 備考欄
    {
      name: 'notes',
      label: t('shipments.fields.notes'),
      field: 'notes',
      align: 'left',
    },
    { name: 'actions', label: t('labels.update'), field: 'id', align: 'center', sortable: false },
  ]

  return { columns }
}
