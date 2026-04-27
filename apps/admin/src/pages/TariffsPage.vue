<template>
  <q-stepper v-model="step" flat animated>

    <q-step name="ranges" :title="$t('tariffs.step1.title')" :done="step === 'values' || step === 'confirm'">
      STEP1
    </q-step>

    <q-step name="values" :title="$t('tariffs.step2.title')" :icon="$icon('edit-note')" :done="step === 'confirm'">
      STEP2
    </q-step>

    <q-step name="confirm" :title="$t('tariffs.step3.title')" :icon="$icon('task-alt')">
      STEP3
    </q-step>

    <template #navigation>
      <q-stepper-navigation class="row q-gutter-x-sm">
        <q-btn v-if="step !== 'ranges'" flat :label="$t('labels.back')" @click="back" />
        <q-space />
        <q-btn v-if="step !== 'confirm'" color="primary" unelevated :label="$t('labels.next')" @click="next" />
        <q-btn v-if="step === 'confirm'" color="primary" unelevated :label="$t('labels.save')" @click="save" />
      </q-stepper-navigation>
    </template>

  </q-stepper>
</template>

<script setup lang="ts">
import { ref } from 'vue'

type Step = 'ranges' | 'values' | 'confirm'

const STEPS: Step[] = ['ranges', 'values', 'confirm']

const step = ref<Step>('ranges')

function next(): void {
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
