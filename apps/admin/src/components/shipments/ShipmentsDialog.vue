<script setup lang="ts">
import { ref, provide } from 'vue'
import { Loading } from 'quasar'
import type { ShipmentDraft } from './shipment-draft'
import { shipmentDraftKey, shipmentStepKey } from './shipment-draft'
import { useShipmentsStore } from 'stores/shipments'
import { useAppStore } from 'stores/app'
import ShipmentsStep1 from './ShipmentsStep1.vue'

const shipmentsStore = useShipmentsStore()
const appStore = useAppStore()

const dialog = ref(false)
const step = ref(1)
const step1Ref = ref<InstanceType<typeof ShipmentsStep1> | null>(null)

const initialDraft = (): ShipmentDraft => ({
  pk: appStore.processingMonth,
  consignorId: '',
  deliveryDate: '',
  origin: '',
  originAddress: '',
  destination: '',
  destinationAddress: '',
  carrierId: null,
  breakdown: [],
  invoice: null,
  details: null,
  notes: '',
})

const draft = ref(initialDraft())

provide(shipmentDraftKey, draft)
provide(shipmentStepKey, step)

/**
 * 次へボタン
 */
async function next(): Promise<void> {
  if (step.value === 1) {
    const ok = await step1Ref.value?.formRef?.validate()
    if (!ok) return
  }
  Loading.show()
  try {
    if (!draft.value.id) {
      const item = await shipmentsStore.create({ ...draft.value })
      draft.value.id = item.id
      draft.value._etag = item._etag
    } else {
      const item = await shipmentsStore.update(draft.value.id, { ...draft.value })
      draft.value._etag = item._etag
    }
  } finally {
    Loading.hide()
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
 * 保存ボタン
 */
async function save(): Promise<void> {
  if (!draft.value.id || !draft.value._etag) return
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
 * ダイアログオープン
 */
function open(): void {
  reset()
  step.value = 1
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

defineExpose<{ open(): void }>({ open })
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
          <div class="row items-center justify-center" style="min-height: 200px">
            <div class="text-h6 text-grey-5">工事中</div>
          </div>
        </q-step>

        <q-step
          :name="3"
          :title="$t('shipments.step3.title')"
          :icon="$icon('edit-note')"
          :done="step > 3"
        >
          <div class="row items-center justify-center" style="min-height: 200px">
            <div class="text-h6 text-grey-5">工事中</div>
          </div>
        </q-step>

        <q-step :name="4" :title="$t('shipments.step4.title')" :icon="$icon('task-alt')">
          <div class="row items-center justify-center" style="min-height: 200px">
            <div class="text-h6 text-grey-5">工事中</div>
          </div>
        </q-step>

        <template #navigation>
          <q-stepper-navigation class="row justify-end q-gutter-x-sm q-pa-md">
            <q-btn v-if="step !== 1" flat :label="$t('labels.back')" @click="back" />
            <q-btn
              v-if="step !== 4"
              color="primary"
              unelevated
              :label="$t('labels.next')"
              @click="next"
            />
            <q-btn
              v-if="step === 4"
              color="primary"
              unelevated
              :label="$t('labels.save')"
              @click="save"
            />
          </q-stepper-navigation>
        </template>
      </q-stepper>
    </q-card>
  </q-dialog>
</template>
