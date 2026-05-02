<template>
  <q-dialog v-model="dialog" persistent>
    <q-card style="width: 720px; max-width: 95vw">

      <q-card-section class="row primary-gradient text-white">
        <div class="text-h6">
          <q-icon :name="$icon('shipments')" />
          {{ $t('navi.shipments') }}
        </div>
        <q-space />
        <q-btn :icon="$icon('close')" flat round dense @click="close" />
      </q-card-section>

      <q-stepper v-model="step" style="height: 5rem;" animated>
        <q-step :name="1" :title="$t('shipments.step1.title')" :done="step > 1" />
        <q-step :name="2" :title="$t('shipments.step2.title')" :icon="$icon('masters-container.carriers')" :done="step > 2" />
        <q-step :name="3" :title="$t('shipments.step3.title')" :icon="$icon('edit-note')" :done="step > 3" />
        <q-step :name="4" :title="$t('shipments.step4.title')" :icon="$icon('task-alt')" />
      </q-stepper>

      <div style="overflow: hidden">
        <Transition :enter-active-class="enterClass" :leave-active-class="leaveClass" mode="out-in">
          <div :key="step" class="row items-center justify-center q-pa-md" style="min-height: 200px">
            <div class="text-h6 text-grey-5">工事中</div>
          </div>
        </Transition>
      </div>

      <q-separator />

      <q-card-actions align="right" class="q-pa-md q-gutter-x-sm">
        <q-btn v-if="step !== 1" flat :label="$t('labels.back')" @click="back" />
        <q-btn v-if="step !== 4" color="primary" unelevated :label="$t('labels.next')" @click="next" />
        <q-btn v-if="step === 4" color="primary" unelevated :label="$t('labels.save')" @click="save" />
      </q-card-actions>

    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

const dialog = ref(false)
const step = ref(1)
const forward = ref(true)

const enterClass = computed(() => forward.value ? 'animated faster slideInRight' : 'animated faster slideInLeft')
const leaveClass = computed(() => forward.value ? 'animated faster slideOutLeft' : 'animated faster slideOutRight')

/**
 * 次へボタン
 */
function next(): void {
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
 * 保存ボタン（未実装）
 */
function save(): void {
  close()
}

/**
 * ダイアログオープン
 */
function open(): void {
  step.value = 1
  dialog.value = true
}

/**
 * ダイアログクローズ
 */
function close(): void {
  step.value = 1
  dialog.value = false
}

defineExpose<{ open(): void }>({ open })
</script>
