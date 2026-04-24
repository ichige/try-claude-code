import { ref, shallowRef, reactive, h, defineComponent } from 'vue'
import { QBtn, Loading } from 'quasar'
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
  const config = await import(`../configs/dialog-form/${container.toLowerCase()}`) as ContainerConfig
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
    return () => h(QBtn, { ...operationConfigs.create, onClick: () => dialogFormStore.open('create') })
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
 * Dialog フォームのセクション一覧・送信関数・非表示ハンドラを返す。
 * @returns sections・onSubmit・onHide
 */
export function useDialogFormConfig() {
  const dialogFormStore = useDialogFormStore()

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

  function onHide(): void {
    if (containerConfig.value) resetForm(containerConfig.value)
  }

  return { sections, onSubmit, onHide }
}
