import { ref, h, defineComponent } from 'vue'
import { QBtn } from 'quasar'
import type { dialogFormButtonConfig as DialogFormButtonConfig } from 'configs/dialog-form-button'
import { useDialogFormStore } from 'stores/dialog-form'

const buttonConfig = ref<typeof DialogFormButtonConfig | null>(null)

/**
 * Dialog フォームボタンの設定を動的 import で読み込み、変数に保存する。
 */
export async function initDialogForm(): Promise<void> {
  const { dialogFormButtonConfig } = await import('configs/dialog-form-button')
  buttonConfig.value = dialogFormButtonConfig
  console.log('dialogFormButtonConfig:', buttonConfig.value)
}

/**
 * Dialog フォームを開くボタンコンポーネントを render 関数として返す。
 * @returns `OpenDialogFormButton` コンポーネント
 */
export function useDialogFormButton() {
  const dialogFormStore = useDialogFormStore()

  const OpenDialogFormButton = defineComponent(() => {
    return () => h(QBtn, { ...buttonConfig.value, onClick: () => dialogFormStore.open() })
  })

  return { OpenDialogFormButton }
}
