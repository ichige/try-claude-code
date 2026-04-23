import { ref, shallowRef, reactive, h, defineComponent } from 'vue'
import { QBtn, Loading } from 'quasar'
import type { z } from 'zod'
import type { ContainerName, MasterStore } from 'stores/masters'
import type { Operation } from 'configs/dialog-form/operations'
import type { DialogFormSection } from 'configs/dialog-form/types'
import { operationConfigs } from 'configs/dialog-form/operations'
import { useDialogFormStore } from 'stores/dialog-form'

interface ContainerConfig {
  schema: z.ZodObject<z.ZodRawShape>
  initialForm: Record<string, string | number | boolean>
  buildItems: (form: Record<string, string | number | boolean>) => DialogFormSection[]
}

const containerConfig = ref<ContainerConfig | null>(null)
const operationConfig = ref<(typeof operationConfigs)[Operation] | null>(null)
const currentStore = shallowRef<MasterStore | null>(null)
const form = reactive<Record<string, string | number | boolean>>({})
const sections = ref<DialogFormSection[]>([])

function resetForm(config: ContainerConfig): void {
  Object.keys(form).forEach((k) => delete form[k])
  Object.assign(form, config.initialForm)
}

/**
 * Dialog フォームの設定をコンテナ名と操作名をもとに動的 import で読み込む。
 * @param container - 操作対象のコンテナ名
 * @param operation - 操作種別
 */
export async function initDialogForm(container: ContainerName, operation: Operation): Promise<void> {
  let config: ContainerConfig
  switch (container) {
    case 'Consignors': {
      const { useConsignorsStore } = await import('stores/masters/consignors')
      config = await import('configs/dialog-form/consignors')
      currentStore.value = useConsignorsStore()
      break
    }
    case 'Carriers': {
      const { useCarriersStore } = await import('stores/masters/carriers')
      config = await import('configs/dialog-form/carriers')
      currentStore.value = useCarriersStore()
      break
    }
    default:
      throw new Error(`No config for container: ${container}`)
  }
  containerConfig.value = config
  operationConfig.value = operationConfigs[operation]
  resetForm(config)
  sections.value = config.buildItems(form)
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
  const dialogFormStore = useDialogFormStore()

  async function onSubmit(): Promise<void> {
    if (!containerConfig.value || !currentStore.value) return
    const parsed = containerConfig.value.schema.safeParse({ ...form })
    if (!parsed.success) return
    Loading.show({ message: '更新中...' })
    try {
      await currentStore.value.create(parsed.data)
      resetForm(containerConfig.value)
      dialogFormStore.close()
    } finally {
      dialogFormStore.close()
      Loading.hide()
    }
  }

  return { sections, onSubmit }
}
