<template>
  <q-dialog :model-value="modelValue" @update:model-value="emit('update:modelValue', $event)">
    <q-card style="width: 680px; max-width: 95vw">

      <q-card-section class="row items-center q-pb-none">
        <div class="text-h6">{{ $t('navi.masters-container.tariffs') }}</div>
        <q-space />
        <q-btn :icon="$icon('close')" flat round dense @click="emit('update:modelValue', false)" />
      </q-card-section>

      <q-stepper v-model="step" flat animated>

        <q-step name="ranges" :title="$t('tariffs.step1.title')" :done="step === 'values' || step === 'confirm'">
          <TariffsStep1 ref="step1Ref" :version="version" />
        </q-step>

        <q-step name="values" :title="$t('tariffs.step2.title')" :icon="$icon('edit-note')" :done="step === 'confirm'">
          <TariffsStep2 ref="step2Ref" />
        </q-step>

        <q-step name="confirm" :title="$t('tariffs.step3.title')" :icon="$icon('task-alt')">
          <TariffsStep3 :version="version" />
        </q-step>

      </q-stepper>

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
import { ref, reactive, computed, provide } from 'vue'
import { useTariffsStore } from 'stores/masters/tariffs'
import { tariffDraftKey } from 'src/composables/tariff-draft'
import TariffsStep1 from 'components/masters/TariffsStep1.vue'
import TariffsStep2 from 'components/masters/TariffsStep2.vue'
import TariffsStep3 from 'components/masters/TariffsStep3.vue'

defineProps<{ modelValue: boolean }>()
const emit = defineEmits<{ 'update:modelValue': [value: boolean] }>()

type Step = 'ranges' | 'values' | 'confirm'
const STEPS: Step[] = ['ranges', 'values', 'confirm']

const step = ref<Step>('ranges')
const step1Ref = ref<InstanceType<typeof TariffsStep1> | null>(null)
const step2Ref = ref<InstanceType<typeof TariffsStep2> | null>(null)

const tariffsStore = useTariffsStore()
const version = computed(() => tariffsStore.list.length + 1)

const draft = reactive({
  name: '',
  notes: '',
  ranges: [{ minKm: 1, maxKm: 20, baseFare: 0, unitKm: 1, unitFare: 0 }],
})
provide(tariffDraftKey, draft)

async function next(): Promise<void> {
  if (step.value === 'ranges') {
    const ok = await step1Ref.value?.formRef?.validate()
    if (!ok) return
  }
  if (step.value === 'values') {
    const ok = await step2Ref.value?.formRef?.validate()
    if (!ok) return
  }
  const idx = STEPS.indexOf(step.value)
  if (idx < STEPS.length - 1) step.value = STEPS[idx + 1]!
}

function back(): void {
  const idx = STEPS.indexOf(step.value)
  if (idx > 0) step.value = STEPS[idx - 1]!
}

function save(): void {
  // TODO: 保存処理
}
</script>
