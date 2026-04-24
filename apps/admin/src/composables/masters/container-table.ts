import { ref, computed, h, defineComponent } from 'vue'
import { QToggle } from 'quasar'
import type { QTableProps } from 'quasar'
import type { CosmosItem } from '@shisamo/shared'
import type { ContainerName } from 'stores/masters'

interface ContainerTableStore {
  list: CosmosItem[]
}

interface ContainerTableConfig {
  columns: QTableProps['columns']
  useStore: () => ContainerTableStore
}

/** 対象のレコード */
const _getRows = ref<() => CosmosItem[]>(() => [])

/** 論理削除の表示フラグ */
const showDeleted = ref(false)

/** 論理削除フィルタ */
const rows = computed(() =>
  showDeleted.value
    ? _getRows.value()
    : _getRows.value().filter((item) => !item.isDeleted),
)

/** テーブルスキーマ */
const columns = ref<QTableProps['columns']>([])

/**
 * コンテナ名をもとにテーブルの rows・columns を動的 import で読み込む。
 * @param container - 表示対象のコンテナ名
 */
export async function initContainerTable(container: ContainerName): Promise<void> {
  const config = await import(`../../configs/container-table/${container.toLowerCase()}`) as ContainerTableConfig
  const store = config.useStore()
  _getRows.value = () => store.list
  columns.value = config.columns
}

/**
 * ContainerTable で使用する rows・columns・フィルタトグルを提供する composable。
 * @returns rows・columns・ShowDeletedToggle
 */
export function useContainerTable() {
  const ShowDeletedToggle = defineComponent(() => {
    return () => h(QToggle, {
      modelValue: showDeleted.value,
      'onUpdate:modelValue': (v: boolean) => { showDeleted.value = v },
      label: '削除済みを表示',
      color: 'negative',
      dense: true,
    })
  })

  return { rows, columns, ShowDeletedToggle }
}
