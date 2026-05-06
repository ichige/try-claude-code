<script setup lang="ts">
import { ref, provide, toRaw } from 'vue'
import { Loading } from 'quasar'
import type { ShipmentsItem } from '@shisamo/shared'
import { shipmentDraftKey, shipmentStepKey } from './shipment-draft'
import { useShipmentsStore } from 'stores/shipments'
import { useShipmentDraft } from 'composables/shipments/use-shipment-draft'
import ShipmentsStep1 from './ShipmentsStep1.vue'
import ShipmentsStep2 from './ShipmentsStep2.vue'
import ShipmentsStep3 from './ShipmentsStep3.vue'
import ShipmentsStep4 from './ShipmentsStep4.vue'

const shipmentsStore = useShipmentsStore()
const { initialDraft } = useShipmentDraft()

const dialog = ref(false)
const step = ref(1)
const step1Ref = ref<InstanceType<typeof ShipmentsStep1> | null>(null)
const step2Ref = ref<InstanceType<typeof ShipmentsStep2> | null>(null)

const draft = ref(initialDraft())

provide(shipmentDraftKey, draft)
provide(shipmentStepKey, step)

/**
 * 次へボタン。DB更新は行わず、バリデートと status 変更のみ実施する。
 * STEP1: status 現状維持(new のまま)。STEP2: new → assigned。STEP3: assigned → submitted。
 */
async function next(): Promise<void> {
  if (step.value === 1) {
    const ok = await step1Ref.value?.formRef?.validate()
    if (!ok) return
  } else if (step.value === 2) {
    const ok = await step2Ref.value?.formRef?.validate()
    if (!ok) return
    if (draft.value.status === 'new') draft.value.status = 'assigned'
  } else if (step.value === 3) {
    if (draft.value.status === 'assigned') draft.value.status = 'submitted'
  }
  step.value++
}

/**
 * 戻るボタン
 */
function back(): void {
  step.value--
}

/**
 * 保存ボタン(全ステップ): バリデート後に create/update してダイアログを閉じる。
 * STEP2 では new → assigned、STEP3 では assigned → submitted へ status を変更する。
 */
async function save(): Promise<void> {
  if (step.value === 1) {
    const ok = await step1Ref.value?.formRef?.validate()
    if (!ok) return
  }
  if (step.value === 2) {
    const ok = await step2Ref.value?.formRef?.validate()
    if (!ok) return
    if (draft.value.status === 'new') draft.value.status = 'assigned'
  }
  if (step.value === 3) {
    if (draft.value.status === 'assigned') draft.value.status = 'submitted'
  }
  Loading.show()
  try {
    if (!draft.value.id) {
      await shipmentsStore.create({ ...draft.value })
    } else {
      await shipmentsStore.update(draft.value.id, { ...draft.value })
    }
    close()
  } finally {
    Loading.hide()
  }
}

/**
 * 承認ボタン(STEP4): status を completed に変更して create/update する。
 */
async function approve(): Promise<void> {
  draft.value.status = 'completed'
  Loading.show()
  try {
    if (!draft.value.id) {
      await shipmentsStore.create({ ...draft.value })
    } else {
      await shipmentsStore.update(draft.value.id, { ...draft.value })
    }
    close()
  } finally {
    Loading.hide()
  }
}

/**
 * 差し戻しボタン(STEP4): status を reverted に戻して編集可能にする。
 */
async function revert(): Promise<void> {
  if (!draft.value.id) return
  draft.value.status = 'reverted'
  Loading.show()
  try {
    await shipmentsStore.update(draft.value.id, { ...draft.value })
    close()
  } finally {
    Loading.hide()
  }
}

/**
 * リセット
 */
function reset(): void {
  draft.value = initialDraft()
}

/**
 * ダイアログオープン（新規作成）
 */
function open(): void {
  reset()
  step.value = 1
  dialog.value = true
}

/**
 * 既存取引の編集ダイアログを開く。
 * completed の場合は STEP4、それ以外は STEP1 から表示する。
 * @param item - 編集対象の取引アイテム
 */
function openEdit(item: ShipmentsItem): void {
  draft.value = structuredClone(toRaw(item))
  step.value = item.status === 'completed' ? 4 : 1
  dialog.value = true
}

/**
 * ダイアログクローズ
 */
function close(): void {
  reset()
  step.value = 1
  dialog.value = false
}

defineExpose<{ open(): void; openEdit(item: ShipmentsItem): void }>({ open, openEdit })
</script>

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

      <q-stepper v-model="step" animated flat>
        <q-step :name="1" :title="$t('shipments.step1.title')" :done="step > 1">
          <ShipmentsStep1 ref="step1Ref" />
        </q-step>

        <q-step
          :name="2"
          :title="$t('shipments.step2.title')"
          :icon="$icon('masters-container.carriers')"
          :done="step > 2"
        >
          <ShipmentsStep2 ref="step2Ref" />
        </q-step>

        <q-step
          :name="3"
          :title="$t('shipments.step3.title')"
          :icon="$icon('edit-note')"
          :done="step > 3"
        >
          <ShipmentsStep3 />
        </q-step>

        <q-step :name="4" :title="$t('shipments.step4.title')" :icon="$icon('task-alt')">
          <ShipmentsStep4 />
        </q-step>

        <template #navigation>
          <q-stepper-navigation class="row justify-end q-gutter-x-sm">
            <!-- 戻るボタンは共通(completedでは非表示) -->
            <q-btn
              v-if="step !== 1 && draft.status !== 'completed'"
              unelevated
              color="grey-5"
              :label="$t('labels.back')"
              :icon="$icon('previous')"
              @click="back"
            />
            <!-- 次へボタンはSTEP3まで -->
            <q-btn
              v-if="step !== 4"
              color="primary"
              unelevated
              size="md"
              :label="$t('labels.next')"
              :icon="$icon('next')"
              @click="next"
            />
            <!-- 保存ボタンは completed 以外で表示 -->
            <q-btn
              v-if="draft.status !== 'completed'"
              color="secondary"
              unelevated
              size="md"
              :label="$t('labels.save')"
              :icon="$icon('save')"
              @click="save"
            />
            <!-- 承認ボタンは STEP4 かつ completed 以外で表示 -->
            <q-btn
              v-if="step === 4 && draft.status !== 'completed'"
              color="positive"
              unelevated
              :disable="draft.status !== 'submitted' && draft.status !== 'reverted'"
              :label="$t('shipments.labels.approve')"
              :icon="$icon('approve')"
              @click="approve"
            />
            <!-- 差し戻しボタンは STEP4 かつ completed で表示 -->
            <q-btn
              v-if="step === 4 && draft.status === 'completed'"
              flat
              color="warning"
              :label="$t('shipments.labels.revert')"
              :icon="$icon('revert')"
              @click="revert"
            />
          </q-stepper-navigation>
        </template>
      </q-stepper>
    </q-card>
  </q-dialog>
</template>
