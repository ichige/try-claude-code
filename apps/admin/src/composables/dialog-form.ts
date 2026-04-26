import { ref, shallowRef, reactive, computed, h, defineComponent } from 'vue'
import { QBtn, Loading, Dialog } from 'quasar'
import type { z } from 'zod'
import type { CosmosItem } from '@shisamo/shared'
import type { ContainerName, MasterStore } from 'stores/masters'
import { operationConfigs } from 'configs/dialog-form/operations'
import type { DialogFormSection } from 'configs/dialog-form/types'
import { useDialogFormStore } from 'stores/dialog-form'

type FormValue = string | number | boolean | null

/**
 * コンテナ(cosmos db)の設定
 */
interface ContainerConfig {
  /** ダイアログタイトルに使用するラベル（例: '荷主情報'） */
  label: string
  /** zod 検証スキーマ */
  schema: z.ZodObject<z.ZodRawShape>
  /** 入力値の初期値 */
  initialForm: Record<string, string | number | boolean>
  /** 入力フォームの部品(render function)を動的に組み立てたもの */
  buildItems: (form: Record<string, FormValue>) => DialogFormSection[]
  /** 対応するマスタストア */
  useStore: () => MasterStore
}

/** コンテナ(cosmos db)の設定 */
const containerConfig = ref<ContainerConfig | null>(null)
/** 更新対象の Store(コンテナ) */
const currentStore = shallowRef<MasterStore | null>(null)
/** 入力値モデル */
const form = reactive<Record<string, FormValue>>({})
/** 入力フォームの部品(buildItems の動的設定値) */
const sections = ref<DialogFormSection[]>([])

/**
 * 入力値のクリア
 */
function clearForm(): void {
  Object.keys(form).forEach((k) => delete form[k])
}

/**
 * 入力値の初期化(登録用)
 * @param config
 */
function resetForm(config: ContainerConfig): void {
  clearForm()
  Object.assign(form, config.initialForm)
}

/**
 * 入力値の初期化(更新用)
 * @param row
 */
function populateForm(row: CosmosItem): void {
  clearForm()
  Object.assign(form, row)
}

/**
 * Dialog フォームの設定をコンテナ名をもとに動的 import で読み込む。
 * @param container - 操作対象のコンテナ名
 */
export async function initDialogForm(container: ContainerName): Promise<void> {
  // 設定ファイルが存在しない場合は落ちるけど、さすがにテストくらいはやってくれ。
  // ※ runtime での import なので、相対パス指定が好ましい。
  const config = await import(`../configs/dialog-form/${container.toLowerCase()}.ts`) as ContainerConfig
  containerConfig.value = config
  currentStore.value = config.useStore()
  resetForm(config)
  sections.value = config.buildItems(form)
}

/**
 * 登録ダイアログを開くボタンコンポーネントを render 関数として返す。
 * @returns `OpenDialogFormButton` コンポーネント
 */
export function useDialogFormCreateButton() {
  const dialogFormStore = useDialogFormStore()
  const OpenDialogFormButton = defineComponent(() => {
    return () => h(QBtn, {
      ...operationConfigs.create,
      onClick: () => dialogFormStore.open('create')
    })
  })

  return { OpenDialogFormButton }
}

/**
 * 編集ダイアログを開く関数を返す。
 * @returns `openUpdateDialog` - 対象行を受け取りダイアログを update モードで開く関数
 */
export function useDialogFormUpdateButton() {
  const dialogFormStore = useDialogFormStore()

  function openUpdateDialog(row: CosmosItem): void {
    populateForm(row)
    dialogFormStore.open('update')
  }

  return { openUpdateDialog }
}

/**
 * 削除系ボタンでの Confirm Dialog
 * @param message
 */
function confirm(message: string): Promise<boolean> {
  return new Promise((resolve) => {
    Dialog.create({
      message,
      ok: { label: 'はい', color: 'primary', unelevated: true },
      cancel: { label: 'キャンセル', color: 'grey', unelevated: true },
    }).onOk(() => resolve(true)).onCancel(() => resolve(false))
  })
}

/**
 * 論理削除を実行する関数を返す。
 * @returns `deleteRow` - 対象行を受け取り論理削除する関数
 */
export function useDialogFormDeleteButton() {
  async function deleteRow(row: CosmosItem): Promise<void> {
    if (!currentStore.value) return
    if (!await confirm('このレコードを削除しますか？')) return
    Loading.show({ message: '削除中...' })
    try {
      await currentStore.value.delete(row.id, row._etag)
    } finally {
      Loading.hide()
    }
  }

  return { deleteRow }
}

/**
 * 論理削除を解除する関数を返す。
 * @returns `restoreRow` - 対象行を受け取り論理削除を解除する関数
 */
export function useDialogFormRestoreButton() {
  async function restoreRow(row: CosmosItem): Promise<void> {
    if (!currentStore.value) return
    if (!await confirm('このレコードを復帰しますか？')) return
    Loading.show({ message: '復帰中...' })
    try {
      await currentStore.value.restore(row.id, row._etag)
    } finally {
      Loading.hide()
    }
  }

  return { restoreRow }
}

/**
 * テーブル行の CRUD 操作に必要な関数・コンポーネントをまとめて返す。
 * @returns OpenDialogFormButton・openUpdateDialog・deleteRow
 */
export function useDialogFormActions() {
  return {
    ...useDialogFormCreateButton(),
    ...useDialogFormUpdateButton(),
    ...useDialogFormDeleteButton(),
    ...useDialogFormRestoreButton(),
  }
}

/**
 * Dialog フォームのセクション一覧・送信関数・非表示ハンドラを返す。
 * @returns sections・onSubmit・onHide
 */
export function useDialogFormConfig() {
  const dialogFormStore = useDialogFormStore()

  /**
   * フォームのサブミット処理
   */
  async function onSubmit(): Promise<void> {
    if (!containerConfig.value || !currentStore.value) return
    const parsed = containerConfig.value.schema.safeParse({ ...form })
    if (!parsed.success) return
    Loading.show({ message: '更新中...' })
    try {
      if (dialogFormStore.mode === 'create') {
        await currentStore.value.create(parsed.data)
      } else {
        if (!form.id) throw new Error('update mode requires form.id')
        await currentStore.value.update(String(form.id), { ...form, ...parsed.data })
      }
      dialogFormStore.close()
    } catch (e) {
      dialogFormStore.close()
      throw e
    } finally {
      Loading.hide()
    }
  }

  /**
   * フォームを閉じるイベントで初期化を実行
   */
  function onHide(): void {
    if (containerConfig.value) resetForm(containerConfig.value)
  }

  const title = computed(() => {
    const label = containerConfig.value?.label ?? ''
    return dialogFormStore.mode === 'create' ? `${label}登録` : `${label}更新`
  })

  return { sections, title, onSubmit, onHide }
}
