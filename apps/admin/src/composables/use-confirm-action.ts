import { Loading, useQuasar } from 'quasar'
import { useI18n } from 'vue-i18n'

/**
 * 確認ダイアログ + ローディング表示を組み合わせた操作を提供する composable。
 */
export function useConfirmAction() {
  const $q = useQuasar()
  const { t } = useI18n()

  /**
   * 確認ダイアログを表示し、OK 時に action を実行する。
   * @param title - ダイアログのタイトル
   * @param message - ダイアログのメッセージ
   * @param action - OK 後に実行する非同期処理
   */
  function confirmAction(title: string, message: string, action: () => Promise<void>): void {
    $q.dialog({
      title,
      message,
      cancel: true,
      persistent: true,
    }).onOk(() => {
      void (async () => {
        Loading.show({ message: t('labels.loading') })
        try {
          await action()
        } finally {
          Loading.hide()
        }
      })()
    })
  }

  return { confirmAction }
}
