import { ref, shallowRef, reactive, h, defineComponent } from 'vue'
import { QBtn, Loading } from 'quasar'
import type { z } from 'zod'
import type { CosmosItem } from '@shisamo/shared'
import type { ContainerName, MasterStore } from 'stores/masters'
import type { OperationConfigs } from 'configs/dialog-form/operations'
import type { DialogFormSection } from 'configs/dialog-form/types'
import { useDialogFormStore } from 'stores/dialog-form'

type FormValue = string | number | boolean | null

interface ContainerConfig {
  schema: z.ZodObject<z.ZodRawShape>
  initialForm: Record<string, string | number | boolean>
  buildItems: (form: Record<string, FormValue>) => DialogFormSection[]
}

const containerConfig = ref<ContainerConfig | null>(null)
const operationConfig = ref<OperationConfigs | null>(null)
const currentStore = shallowRef<MasterStore | null>(null)
const form = reactive<Record<string, FormValue>>({})
const sections = ref<DialogFormSection[]>([])

function resetForm(config: ContainerConfig): void {
  Object.keys(form).forEach((k) => delete form[k])
  Object.assign(form, config.initialForm)
}

function populateForm(row: CosmosItem): void {
  Object.keys(form).forEach((k) => delete form[k])
  Object.assign(form, row)
}

/**
 * Dialog フォームの設定をコンテナ名をもとに動的 import で読み込む。
 * @param container - 操作対象のコンテナ名
 */
export async function initDialogForm(container: ContainerName): Promise<void> {
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
  operationConfig.value = (await import('configs/dialog-form/operations')).operationConfigs
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
    return () => h(QBtn, { ...operationConfig.value?.create, onClick: () => dialogFormStore.open('create') })
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
        await currentStore.value.update(String(form.id), { ...form, ...parsed.data })
      }
      resetForm(containerConfig.value)
      dialogFormStore.close()
    } finally {
      dialogFormStore.close()
      Loading.hide()
    }
  }

  function onHide(): void {
    if (containerConfig.value) resetForm(containerConfig.value)
  }

  return { sections, onSubmit, onHide }
}
