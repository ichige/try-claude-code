import { ref, computed, h, defineComponent } from 'vue'
import { QToggle } from 'quasar'
import type { QTableProps } from 'quasar'
import type { CosmosItem } from '@shisamo/shared'
import type { ContainerName } from 'stores/masters'

interface ContainerTableStore {
  list: CosmosItem[]
}

export interface ContainerTableMeta {
  titleKey: string
  icon: string
}

interface ContainerTableConfig {
  columns: QTableProps['columns']
  useStore: () => ContainerTableStore
  meta: ContainerTableMeta
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

/** テーブルスキーマ（i18n キー） */
const _columns = ref<QTableProps['columns']>([])

/** テーブルヘッダー情報 */
const meta = ref<ContainerTableMeta>({ titleKey: '', icon: '' })

/**
 * コンテナ名をもとにテーブルの rows・columns を動的 import で読み込む。
 * @param container - 表示対象のコンテナ名
 */
export async function initContainerTable(container: ContainerName): Promise<void> {
  const config = await import(`../../configs/container-table/${container.toLowerCase()}.ts`) as ContainerTableConfig
  const store = config.useStore()
  _getRows.value = () => store.list
  _columns.value = config.columns
  meta.value = config.meta
}

/**
 * ContainerTable で使用する rows・columns・フィルタトグルを提供する composable。
 * @returns rows・columns・ShowDeletedToggle
 */
export function useContainerTable() {
  const columns = computed(() => _columns.value)

  const ShowDeletedToggle = defineComponent(() => {
    return () => h(QToggle, {
      modelValue: showDeleted.value,
      'onUpdate:modelValue': (v: boolean) => { showDeleted.value = v },
      label: '削除済みを表示',
      color: 'negative',
      dense: true,
    })
  })

  return { rows, columns, meta, ShowDeletedToggle }
}
