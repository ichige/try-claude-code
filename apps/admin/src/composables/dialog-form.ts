import { ref, h, defineComponent } from 'vue'
import { QBtn } from 'quasar'
import type { z } from 'zod'
import type { ContainerName } from 'stores/masters'
import type { Operation } from 'configs/dialog-form/operations'
import { operationConfigs } from 'configs/dialog-form/operations'
import { useDialogFormStore } from 'stores/dialog-form'

interface ContainerConfig {
  schema: z.ZodObject<z.ZodRawShape>
  initialForm: Record<string, string | number>
}

const containerConfig = ref<ContainerConfig | null>(null)
const operationConfig = ref<(typeof operationConfigs)[Operation] | null>(null)

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
  operationConfig.value = operationConfigs[operation]
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
 * Dialog フォームのコンテナ設定と操作設定を返す。
 * @returns コンテナ設定と操作設定
 */
export function useDialogFormConfig() {
  return { containerConfig, operationConfig }
}
