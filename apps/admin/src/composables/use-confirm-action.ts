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

  /**
   * テキスト入力付き確認ダイアログを表示し、OK 時に入力値を渡して action を実行する。
   * @param title - ダイアログのタイトル
   * @param message - ダイアログのメッセージ
   * @param defaultValue - 入力欄の初期値
   * @param action - OK 後に実行する非同期処理。入力値を受け取る
   */
  function confirmPrompt(title: string, message: string, defaultValue: string, action: (value: string) => Promise<void>): void {
    $q.dialog({
      title,
      message,
      prompt: { model: defaultValue, type: 'text' },
      cancel: true,
      persistent: true,
    }).onOk((value: string) => {
      void (async () => {
        Loading.show({ message: t('labels.loading') })
        try {
          await action(value)
        } finally {
          Loading.hide()
        }
      })()
    })
  }

  return { confirmAction, confirmPrompt }
}
