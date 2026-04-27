<template>
  <q-dialog
    v-model="dialog"
    persistent
    >
    <q-card style="width: 680px; max-width: 95vw">

      <q-card-section class="row primary-gradient text-white">
        <div class="text-h6">
          <q-icon :name="$icon('masters-container.tariffs')" />
          {{ $t('navi.masters-container.tariffs') }}
        </div>
        <q-space />
        <q-btn :icon="$icon('close')" flat round dense @click="close" />
      </q-card-section>

      <!-- ステップインジケーターのみ。コンテンツは TariffsForm に集約 -->
      <q-stepper v-model="step" style="height: 5rem;" animated>
        <q-step name="ranges" :title="$t('tariffs.step1.title')" :done="step === 'values' || step === 'confirm'" />
        <q-step name="values" :title="$t('tariffs.step2.title')" :icon="$icon('edit-note')" :done="step === 'confirm'" />
        <q-step name="confirm" :title="$t('tariffs.step3.title')" :icon="$icon('task-alt')" />
      </q-stepper>

      <div style="overflow: hidden">
        <Transition :enter-active-class="enterClass" :leave-active-class="leaveClass" mode="out-in">
          <TariffsForm :key="step" ref="formRef" />
        </Transition>
      </div>

      <q-separator />

      <q-card-actions align="right" class="q-pa-md q-gutter-x-sm">
        <q-btn v-if="step !== 'ranges'" flat :label="$t('labels.back')" @click="back" />
        <q-btn v-if="step !== 'confirm'" color="primary" unelevated :label="$t('labels.next')" @click="next" />
        <q-btn v-if="step === 'confirm'" color="primary" unelevated :label="$t('labels.save')" @click="save" />
      </q-card-actions>

    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { ref, computed, provide } from 'vue'
import { useTariffsStore } from 'stores/masters/tariffs'
import { tariffDraftKey, tariffStepKey, tariffVersionKey } from 'src/composables/tariff-draft'
import TariffsForm from 'components/masters/TariffsForm.vue'

type Step = 'ranges' | 'values' | 'confirm'
const dialog = ref(false)
const STEPS: Step[] = ['ranges', 'values', 'confirm']

const step = ref<Step>('ranges')
const formRef = ref<InstanceType<typeof TariffsForm> | null>(null)
const forward = ref(true)

const enterClass = computed(() => forward.value ? 'animated faster slideInRight' : 'animated faster slideInLeft')
const leaveClass = computed(() => forward.value ? 'animated faster slideOutLeft' : 'animated faster slideOutRight')

const tariffsStore = useTariffsStore()
const version = computed(() => tariffsStore.list.length + 1)
const stepNumber = computed(() => (STEPS.indexOf(step.value) + 1) as 1 | 2 | 3)

const initialDraft = () => ({
  name: '',
  notes: '',
  ranges: [{ minKm: 1, maxKm: 20, baseFare: 0, unitKm: 1, unitFare: 0 }],
})

const draft = ref(initialDraft())

provide(tariffDraftKey, draft)
provide(tariffStepKey, stepNumber)
provide(tariffVersionKey, version)

async function next(): Promise<void> {
  const ok = await formRef.value?.formRef?.validate()
  if (!ok) return
  forward.value = true
  const idx = STEPS.indexOf(step.value)
  if (idx < STEPS.length - 1) step.value = STEPS[idx + 1]!
}

function back(): void {
  forward.value = false
  const idx = STEPS.indexOf(step.value)
  if (idx > 0) step.value = STEPS[idx - 1]!
}

function save(): void {
  // TODO: 保存処理
}

/**
 * データのリセット
 */
function reset(): void {
  draft.value = initialDraft()
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
  console.log('close', JSON.stringify(draft.value))
  step.value = 'ranges'
  dialog.value = false
}

defineExpose<{ open(): void }>({ open })

</script>
