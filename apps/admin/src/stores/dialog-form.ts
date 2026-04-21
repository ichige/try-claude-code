import { defineStore, acceptHMRUpdate } from 'pinia'
import { ref } from 'vue'

export const useDialogFormStore = defineStore('dialog-form', () => {
  const isOpen = ref(false)

  /**
   * Dialog フォームを開く。
   */
  function open(): void {
    isOpen.value = true
  }

  /**
   * Dialog フォームを閉じる。
   */
  function close(): void {
    isOpen.value = false
  }

  return { isOpen, open, close }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useDialogFormStore, import.meta.hot))
}
