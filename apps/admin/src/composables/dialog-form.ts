import { ref, reactive, h, defineComponent } from 'vue'
import { QBtn, Loading } from 'quasar'
import type { z } from 'zod'
import type { ContainerName } from 'stores/masters'
import type { Operation } from 'configs/dialog-form/operations'
import type { DialogFormSection } from 'configs/dialog-form/types'
import { operationConfigs } from 'configs/dialog-form/operations'
import { useDialogFormStore } from 'stores/dialog-form'
import { useMastersStore } from 'stores/masters'

interface ContainerConfig {
  schema: z.ZodObject<z.ZodRawShape>
  initialForm: Record<string, string | number>
  buildItems: (form: Record<string, string | number>) => DialogFormSection[]
}

const containerConfig = ref<ContainerConfig | null>(null)
const operationConfig = ref<(typeof operationConfigs)[Operation] | null>(null)
const currentContainer = ref<ContainerName | null>(null)
const form = reactive<Record<string, string | number>>({})
const sections = ref<DialogFormSection[]>([])

function resetForm(): void {
  if (!containerConfig.value) return
  Object.keys(form).forEach((k) => delete form[k])
  Object.assign(form, containerConfig.value.initialForm)
}

/**
 * Dialog フォームの設定をコンテナ名と操作名をもとに動的 import で読み込む。
 * @param container - 操作対象のコンテナ名
 * @param operation - 操作種別
 */
export async function initDialogForm(container: ContainerName, operation: Operation): Promise<void> {
  switch (container) {
    case 'Consignors':
      containerConfig.value = await import('configs/dialog-form/consignors')
      break
    default:
      throw new Error(`No config for container: ${container}`)
  }
  currentContainer.value = container
  operationConfig.value = operationConfigs[operation]
  resetForm()
  sections.value = containerConfig.value.buildItems(form)
}

/**
 * Dialog フォームを開くボタンコンポーネントを render 関数として返す。
 * @returns `OpenDialogFormButton` コンポーネント
 */
export function useDialogFormButton() {
  const dialogFormStore = useDialogFormStore()

  const OpenDialogFormButton = defineComponent(() => {
    return () => h(QBtn, { ...operationConfig.value, onClick: () => dialogFormStore.open() })
  })

  return { OpenDialogFormButton }
}

/**
 * Dialog フォームのセクション一覧と送信関数を返す。
 * @returns sections・onSubmit
 */
export function useDialogFormConfig() {
  const mastersStore = useMastersStore()
  const dialogFormStore = useDialogFormStore()

  async function onSubmit(): Promise<void> {
    if (!containerConfig.value || !currentContainer.value) return
    const parsed = containerConfig.value.schema.safeParse({ ...form })
    if (!parsed.success) return
    Loading.show({ message: '更新中...' })
    try {
      await mastersStore.create(currentContainer.value, parsed.data)
      resetForm()
      dialogFormStore.close()
    } finally {
      dialogFormStore.close()
      Loading.hide()
    }
  }

  return { sections, onSubmit }
}
