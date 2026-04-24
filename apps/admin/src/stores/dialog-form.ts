import { defineStore, acceptHMRUpdate } from 'pinia'
import { ref } from 'vue'

export type DialogMode = 'create' | 'update'

export const useDialogFormStore = defineStore('dialog-form', () => {
  const isOpen = ref(false)
  const mode = ref<DialogMode>('create')

  /**
   * Dialog フォームを開く。
   * @param dialogMode - 操作モード（デフォルト: 'create'）
   */
  function open(dialogMode: DialogMode = 'create'): void {
    mode.value = dialogMode
    isOpen.value = true
  }

  /**
   * Dialog フォームを閉じる。
   */
  function close(): void {
    isOpen.value = false
  }

  return { isOpen, mode, open, close }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useDialogFormStore, import.meta.hot))
}
