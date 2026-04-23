import { ref, computed } from 'vue'
import type { QTableProps } from 'quasar'
import type { CosmosItem } from '@shisamo/shared'
import type { ContainerName } from 'stores/masters'

const _getRows = ref<() => CosmosItem[]>(() => [])
const rows = computed(() => _getRows.value())
const columns = ref<QTableProps['columns']>([])

/**
 * コンテナ名をもとにテーブルの rows・columns を動的 import で読み込む。
 * @param container - 表示対象のコンテナ名
 */
export async function initContainerTable(container: ContainerName): Promise<void> {
  switch (container) {
    case 'Consignors': {
      const { useConsignorsStore } = await import('stores/masters/consignors')
      const store = useConsignorsStore()
      _getRows.value = () => store.list
      columns.value = (await import('configs/container-table/consignors')).columns
      break
    }
    case 'Carriers': {
      const { useCarriersStore } = await import('stores/masters/carriers')
      const store = useCarriersStore()
      _getRows.value = () => store.list
      columns.value = (await import('configs/container-table/carriers')).columns
      break
    }
    default:
      throw new Error(`No config for container: ${container}`)
  }
}

/**
 * ContainerTable で使用する rows・columns を提供する composable。
 * @returns rows - ストアのアイテムリスト、columns - テーブルカラム定義
 */
export function useContainerTable() {
  return { rows, columns }
}
