<script setup lang="ts">
import { computed } from 'vue'
import type { ShipmentDraft } from './shipment-draft'
import { useConsignorsStore } from 'stores/masters/consignors'
import { useCarriersStore } from 'stores/masters/carriers'
import { BREAKDOWN_DEFS } from 'src/configs/shipments/breakdown'

const props = defineProps<{ item: ShipmentDraft }>()

const consignorsStore = useConsignorsStore()
const carriersStore = useCarriersStore()

const consignorName = computed(
  () => consignorsStore.list.find((c) => c.id === props.item.consignorId)?.companyName ?? props.item.consignorId,
)

const carrierName = computed(() => {
  if (!props.item.carrierId) return '―'
  return carriersStore.list.find((c) => c.id === props.item.carrierId)?.companyName ?? props.item.carrierId
})

const breakdownRows = computed(() =>
  BREAKDOWN_DEFS
    .map((def) => ({
      label: def.label,
      suffix: def.suffix,
      quantity: props.item.breakdown.find((b) => b.code === def.code)?.quantity ?? 0,
    }))
    .filter((row) => row.quantity > 0),
)
</script>

<template>
  <q-card flat bordered>
    <!-- 基本情報 -->
    <q-card-section class="q-py-sm">
      <div class="row items-center q-mb-xs">
        <q-icon :name="$icon('basic')" size="xs" />
        <div class="text-caption text-primary q-ml-xs">{{ $t('labels.basic') }}</div>
      </div>
    </q-card-section>
    <q-list dense>
      <q-item>
        <q-item-section class="text-caption text-grey-7" style="max-width: 140px">
          {{ $t('shipments.fields.consignorId') }}
        </q-item-section>
        <q-item-section>{{ consignorName }}</q-item-section>
      </q-item>
      <q-item>
        <q-item-section class="text-caption text-grey-7" style="max-width: 140px">
          {{ $t('shipments.fields.deliveryDate') }}
        </q-item-section>
        <q-item-section>{{ item.deliveryDate }}</q-item-section>
      </q-item>
    </q-list>

    <q-separator />

    <!-- 発送元 -->
    <q-card-section class="q-py-sm">
      <div class="row items-center q-mb-xs">
        <q-icon :name="$icon('address')" size="xs" />
        <div class="text-caption text-primary q-ml-xs">{{ $t('shipments.fields.origin') }}</div>
      </div>
    </q-card-section>
    <q-list dense>
      <q-item>
        <q-item-section class="text-caption text-grey-7" style="max-width: 140px">
          {{ $t('shipments.fields.origin') }}
        </q-item-section>
        <q-item-section>{{ item.origin }}</q-item-section>
      </q-item>
      <q-item>
        <q-item-section class="text-caption text-grey-7" style="max-width: 140px">
          {{ $t('shipments.fields.originAddress') }}
        </q-item-section>
        <q-item-section>{{ item.originAddress || '―' }}</q-item-section>
      </q-item>
    </q-list>

    <q-separator />

    <!-- 納品先 -->
    <q-card-section class="q-py-sm">
      <div class="row items-center q-mb-xs">
        <q-icon :name="$icon('masters-container.consignees')" size="xs" />
        <div class="text-caption text-primary q-ml-xs">{{ $t('shipments.fields.destination') }}</div>
      </div>
    </q-card-section>
    <q-list dense>
      <q-item>
        <q-item-section class="text-caption text-grey-7" style="max-width: 140px">
          {{ $t('shipments.fields.destination') }}
        </q-item-section>
        <q-item-section>{{ item.destination }}</q-item-section>
      </q-item>
      <q-item>
        <q-item-section class="text-caption text-grey-7" style="max-width: 140px">
          {{ $t('shipments.fields.destinationAddress') }}
        </q-item-section>
        <q-item-section>{{ item.destinationAddress || '―' }}</q-item-section>
      </q-item>
    </q-list>

    <q-separator />

    <!-- 配送業者 -->
    <q-card-section class="q-py-sm">
      <div class="row items-center q-mb-xs">
        <q-icon :name="$icon('masters-container.carriers')" size="xs" />
        <div class="text-caption text-primary q-ml-xs">{{ $t('shipments.fields.carrierId') }}</div>
      </div>
    </q-card-section>
    <q-list dense>
      <q-item>
        <q-item-section class="text-caption text-grey-7" style="max-width: 140px">
          {{ $t('shipments.fields.carrierId') }}
        </q-item-section>
        <q-item-section>{{ carrierName }}</q-item-section>
      </q-item>
    </q-list>

    <!-- 実績 -->
    <template v-if="breakdownRows.length > 0">
      <q-separator />
      <q-card-section class="q-py-sm">
        <div class="row items-center q-mb-xs">
          <q-icon :name="$icon('edit-note')" size="xs" />
          <div class="text-caption text-primary q-ml-xs">{{ $t('shipments.step3.title') }}</div>
        </div>
      </q-card-section>
      <q-list dense>
        <q-item v-for="row in breakdownRows" :key="row.label">
          <q-item-section class="text-caption text-grey-7" style="max-width: 140px">
            {{ row.label }}
          </q-item-section>
          <q-item-section>{{ row.quantity }} {{ row.suffix }}</q-item-section>
        </q-item>
      </q-list>
    </template>
  </q-card>
</template>
