<script setup lang="ts">
import { ref, computed, inject } from 'vue'
import type { QForm } from 'quasar'
import { useConsignorsStore } from 'stores/masters/consignors'
import { useAppStore } from 'stores/app'
import { zodRule } from 'src/utils/zod-rule'
import { shipmentDraftKey } from './shipment-draft'
import ListSelectBtn from 'src/components/ListSelectBtn.vue'
import { step1Schema } from 'src/configs/shipments/schemas'
import { useShipmentOptions } from 'src/composables/shipments/use-shipment-options'

const draft = inject(shipmentDraftKey)!
const appStore = useAppStore()
const consignorsStore = useConsignorsStore()
const datePopupRef = ref<{ hide(): void } | null>(null)
const formRef = ref<InstanceType<typeof QForm> | null>(null)

const { consignorOptions, consigneeOptions, forwarderOptions } = useShipmentOptions()

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

/**
 * @param val - QDate から渡される日付文字列、または再クリック時の null
 */
function onDeliveryDateUpdate(val: string | null): void {
  if (val === null) return
  draft.value.deliveryDate = val
  closeDatePopup()
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
        <!-- 取引先 -->
        <q-input
          :model-value="consignorsStore.nameById(draft.consignorId)"
          :label="$t('shipments.fields.consignorId')"
          outlined
          dense
          readonly
          :rules="[(_val) => zodRule(step1Schema.shape.consignorId)(draft.consignorId)]"
          class="col-6"
        >
          <template #before>
            <ListSelectBtn
              :options="consignorOptions"
              @select="(val) => (draft.consignorId = val)"
            />
          </template>
          <template #prepend>
            <q-icon :name="$icon('companyName')" size="xs" />
          </template>
        </q-input>

        <!-- 配送日 -->
        <q-input
          :model-value="draft.deliveryDate"
          :label="$t('shipments.fields.deliveryDate')"
          outlined
          dense
          readonly
          :rules="[zodRule(step1Schema.shape.deliveryDate)]"
          class="col-4"
        >
          <template #before>
            <q-icon :name="$icon('list-alt')" class="cursor-pointer" size="xs" color="secondary">
              <q-popup-proxy ref="datePopupRef" cover>
                <q-date
                  :model-value="draft.deliveryDate"
                  mask="YYYY-MM-DD"
                  :default-year-month="monthPrefix"
                  :navigation-min-year-month="monthPrefix"
                  :navigation-max-year-month="monthPrefix"
                  :options="dateOptions"
                  @update:model-value="onDeliveryDateUpdate"
                />
              </q-popup-proxy>
            </q-icon>
          </template>
          <template #prepend>
            <q-icon :name="$icon('calendar-month')" size="xs" />
          </template>
        </q-input>
      </div>
    </q-card-section>

    <q-separator />

    <q-card-section>
      <div class="col-12 row items-center q-mb-sm">
        <q-icon :name="$icon('address')" size="xs" />
        <div class="text-caption text-primary q-mr-sm">{{ $t('shipments.fields.origin') }}</div>
        <div class="col bg-grey-5" style="height: 1px" />
      </div>

      <!-- 発送地 -->
      <div class="row q-col-gutter-sm">
        <q-input
          v-model="draft.origin"
          :label="$t('shipments.fields.origin')"
          outlined
          dense
          :rules="[zodRule(step1Schema.shape.origin)]"
          class="col-4"
          clearable
          @clear="() => (draft.origin = '')"
        >
          <template #before>
            <ListSelectBtn :options="forwarderOptions" @select="(val) => (draft.origin = val)" />
          </template>
          <template #prepend>
            <q-icon :name="$icon('origin')" size="xs" />
          </template>
        </q-input>

        <!-- 発送地住所 -->
        <q-input
          v-model="draft.originAddress"
          :label="$t('shipments.fields.originAddress')"
          outlined
          dense
          clearable
          class="col-8"
          @clear="() => (draft.originAddress = '')"
        >
          <template #prepend>
            <q-icon :name="$icon('address')" size="xs" />
          </template>
        </q-input>
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
          clearable
          :rules="[zodRule(step1Schema.shape.destination)]"
          class="col-4"
          @clear="() => (draft.destination = '')"
        >
          <template #before>
            <ListSelectBtn
              :options="consigneeOptions"
              @select="(val) => (draft.destination = val)"
            />
          </template>
          <template #prepend>
            <q-icon :name="$icon('destination')" size="xs" />
          </template>
        </q-input>
        <q-input
          v-model="draft.destinationAddress"
          :label="$t('shipments.fields.destinationAddress')"
          outlined
          dense
          clearable
          class="col-8"
          @clear="() => (draft.destinationAddress = '')"
        >
          <template #prepend>
            <q-icon :name="$icon('address')" size="xs" />
          </template>
        </q-input>
      </div>
    </q-card-section>
  </q-form>
</template>
