<script setup lang="ts">
import { ref, computed, inject } from 'vue'
import type { QForm } from 'quasar'
import { useConsignorsStore } from 'stores/masters/consignors'
import { useAppStore } from 'stores/app'
import { zodRule } from 'src/utils/zod-rule'
import { shipmentDraftKey } from './shipment-draft'
import ForwarderSelect from './ForwarderSelect.vue'
import { step1Schema } from 'src/configs/shipments/step1'

const draft = inject(shipmentDraftKey)!
const appStore = useAppStore()
const consignorsStore = useConsignorsStore()
const datePopupRef = ref<{ hide(): void } | null>(null)
const formRef = ref<InstanceType<typeof QForm> | null>(null)

/**
 * 顧客の選択
 */
const consignorOptions = computed(() =>
  consignorsStore.list.map((c) => ({ label: c.companyName, value: c.id })),
)

/**
 * QDate の options 制限と default-year-month に使う YYYY/MM 形式
 */
const monthPrefix = computed(() => {
  const ym = appStore.processingMonth
  return `${ym.substring(0, 4)}/${ym.substring(4, 6)}`
})

/**
 * @param date - YYYY/MM/DD 形式の日付文字列
 * @returns 処理月内の日付か
 */
const dateOptions = (date: string) => date.startsWith(monthPrefix.value)

/**
 * Popup操作
 */
function closeDatePopup(): void {
  datePopupRef.value?.hide()
}

defineExpose({ formRef })
</script>

<template>
  <q-form ref="formRef" greedy>
    <!-- 基本情報 -->
    <q-card-section>
      <div class="col-12 row items-center q-mb-sm">
        <q-icon :name="$icon('basic')" size="xs" />
        <div class="text-caption text-primary q-mr-sm">{{ $t('labels.basic') }}</div>
        <div class="col bg-grey-5" style="height: 1px" />
      </div>
      <div class="row q-col-gutter-sm">
        <q-select
          v-model="draft.consignorId"
          :options="consignorOptions"
          :label="$t('shipments.fields.consignorId')"
          outlined
          dense
          emit-value
          map-options
          :rules="[zodRule(step1Schema.shape.consignorId, $t('shipments.fields.consignorId'))]"
          class="col-8"
        >
          <template #prepend>
            <q-icon :name="$icon('companyName')" size="xs" />
          </template>
        </q-select>

        <q-input
          :model-value="draft.deliveryDate"
          :label="$t('shipments.fields.deliveryDate')"
          outlined
          dense
          readonly
          :rules="[zodRule(step1Schema.shape.deliveryDate, $t('shipments.fields.deliveryDate'))]"
          class="col-4"
        >
          <template #prepend>
            <q-icon :name="$icon('calendar-month')" size="xs" />
          </template>
          <template #append>
            <q-icon name="sym_o_event" class="cursor-pointer">
              <q-popup-proxy ref="datePopupRef" cover>
                <q-date
                  v-model="draft.deliveryDate"
                  mask="YYYY-MM-DD"
                  :default-year-month="monthPrefix"
                  :navigation-min-year-month="monthPrefix"
                  :navigation-max-year-month="monthPrefix"
                  :options="dateOptions"
                  @update:model-value="closeDatePopup"
                />
              </q-popup-proxy>
            </q-icon>
          </template>
        </q-input>
      </div>
    </q-card-section>

    <q-separator />

    <!-- 発送元 -->
    <q-card-section>
      <div class="col-12 row items-center q-mb-sm">
        <q-icon :name="$icon('address')" size="xs" />
        <div class="text-caption text-primary q-mr-sm">{{ $t('shipments.fields.origin') }}</div>
        <div class="col bg-grey-5" style="height: 1px" />
      </div>
      <div class="row q-col-gutter-sm">
        <q-input
          v-model="draft.origin"
          :label="$t('shipments.fields.origin')"
          outlined
          dense
          :rules="[zodRule(step1Schema.shape.origin, $t('shipments.fields.origin'))]"
          class="col-4"
        >
          <template #before>
            <ForwarderSelect @select="(val) => (draft.origin = val)" />
          </template>
        </q-input>
        <q-input
          v-model="draft.originAddress"
          :label="$t('shipments.fields.originAddress')"
          outlined
          dense
          class="col-8"
        />
      </div>
    </q-card-section>

    <q-separator />

    <!-- 納品先 -->
    <q-card-section>
      <div class="col-12 row items-center q-mb-sm">
        <q-icon :name="$icon('masters-container.consignees')" size="xs" />
        <div class="text-caption text-primary q-mr-sm">
          {{ $t('shipments.fields.destination') }}
        </div>
        <div class="col bg-grey-5" style="height: 1px" />
      </div>
      <div class="row q-col-gutter-sm">
        <q-input
          v-model="draft.destination"
          :label="$t('shipments.fields.destination')"
          outlined
          dense
          :rules="[zodRule(step1Schema.shape.destination, $t('shipments.fields.destination'))]"
          class="col-4"
        >
          <template #before>
            <ForwarderSelect @select="(val) => (draft.destination = val)" />
          </template>
        </q-input>
        <q-input
          v-model="draft.destinationAddress"
          :label="$t('shipments.fields.destinationAddress')"
          outlined
          dense
          class="col-8"
        />
      </div>
    </q-card-section>
  </q-form>
</template>
