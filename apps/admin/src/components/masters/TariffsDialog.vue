<template>
  <q-dialog
    v-model="dialog"
    persistent
    >
    <q-card style="width: 680px; max-width: 95vw">

      <q-card-section class="row primary-gradient text-white">
        <div class="text-h6">
          <q-icon :name="$icon('masters-tariffs')" />
          {{ $t('navi.masters-tariffs') }}
        </div>
        <q-space />
        <q-btn :icon="$icon('close')" flat round dense @click="close" />
      </q-card-section>

      <!-- ステップインジケーターのみ。コンテンツは TariffsForm に集約 -->
      <q-stepper v-model="step" style="height: 5rem;" animated>
        <q-step :name="1" :title="$t('tariffs.step1.title')" :done="step > 1" />
        <q-step :name="2" :title="$t('tariffs.step2.title')" :icon="$icon('edit-note')" :done="step > 2" />
        <q-step :name="3" :title="$t('tariffs.step3.title')" :icon="$icon('task-alt')" />
      </q-stepper>

      <div style="overflow: hidden">
        <Transition :enter-active-class="enterClass" :leave-active-class="leaveClass" mode="out-in">
          <TariffsForm :key="step" ref="formRef" />
        </Transition>
      </div>

      <q-separator />

      <q-card-actions align="right" class="q-pa-md q-gutter-x-sm">
        <q-btn v-if="step !== 1" flat :label="$t('labels.back')" @click="back" />
        <q-btn v-if="step !== 3" color="primary" unelevated :label="$t('labels.next')" @click="next" />
        <q-btn v-if="step === 3" color="primary" unelevated :label="$t('labels.save')" @click="save" />
      </q-card-actions>

    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { ref, computed, provide } from 'vue'
import { Loading } from 'quasar'
import { useTariffsStore } from 'stores/masters/tariffs'
import { tariffDraftKey, tariffStepKey, type TariffDraft } from './tariff-draft'
import TariffsForm from 'components/masters/TariffsForm.vue'

const emit = defineEmits<{ created: [id: string] }>()

const dialog = ref(false)
const step = ref(1)
const formRef = ref<InstanceType<typeof TariffsForm> | null>(null)
const forward = ref(true)

// animation 調整用
const enterClass = computed(() => forward.value ? 'animated faster slideInRight' : 'animated faster slideInLeft')
const leaveClass = computed(() => forward.value ? 'animated faster slideOutLeft' : 'animated faster slideOutRight')

const tariffsStore = useTariffsStore()
const version = computed(() => tariffsStore.list.length + 1)

/**
 * 入力の初期値
 * @param version
 */
const initialDraft = (version: number): TariffDraft => ({
  id: `v${version}`,
  name: '',
  notes: '',
  enabled: false,
  isActive: false,
  ranges: [{ minKm: 1, maxKm: 20, baseFare: 0, unitKm: 1, unitFare: 0 }],
})

// 初期値
const draft = ref(initialDraft(version.value))

// Form へは provide で渡す
provide(tariffDraftKey, draft)
provide(tariffStepKey, step)

/**
 * 次へボタン
 */
async function next(): Promise<void> {
  const ok = await formRef.value?.formRef?.validate()
  if (!ok) return
  forward.value = true
  step.value++
}

/**
 * 戻るボタン
 */
function back(): void {
  forward.value = false
  step.value--
}

/**
 * 保存ボタン
 */
async function save(): Promise<void> {
  Loading.show({ message: '保存中...' })
  const id = draft.value.id
  try {
    await tariffsStore.create(draft.value)
    emit('created', id)
    close()
  } catch (e) {
    close()
    throw e
  } finally {
    Loading.hide()
  }
}

/**
 * データのリセット
 */
function reset(): void {
  draft.value = initialDraft(version.value)
}

/**
 * ダイアログオープン
 */
const open = () => { dialog.value = true }

/**
 * ダイアログクローズ
 */
const close = () => {
  reset()
  step.value = 1
  dialog.value = false
}

defineExpose<{ open(): void }>({ open })

</script>
