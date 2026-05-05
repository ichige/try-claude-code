<script setup lang="ts">
import { computed } from 'vue'
import type { ShipmentDraft } from './shipment-draft'
import { useConsignorsStore } from 'stores/masters/consignors'
import { useCarriersStore } from 'stores/masters/carriers'
import { BREAKDOWN_DEFS } from 'src/configs/shipments/breakdown'

const props = defineProps<{ item: ShipmentDraft }>()

const consignorsStore = useConsignorsStore()
const carriersStore = useCarriersStore()

const breakdownRows = computed(() =>
  BREAKDOWN_DEFS.map((def) => ({
    code: def.code,
    label: def.label,
    suffix: def.suffix,
    quantity: props.item.breakdown.find((b) => b.code === def.code)?.quantity ?? 0,
  })),
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
        <q-item-section style="max-width: 6rem">
          <q-item-label lines="1">
            <q-icon :name="$icon('companyName')" size="xs" />
            <span class="text-caption text-grey-7 q-ml-xs">
              {{ $t('shipments.fields.consignorId') }}
            </span>
          </q-item-label>
        </q-item-section>
        <q-item-section>{{ consignorsStore.nameById(item.consignorId) }}</q-item-section>
      </q-item>
      <q-item>
        <q-item-section style="max-width: 6rem">
          <q-item-label lines="1">
            <q-icon :name="$icon('deliveryDate')" size="xs" />
            <span class="text-caption text-grey-7 q-ml-xs">
              {{ $t('shipments.fields.deliveryDate') }}
            </span>
          </q-item-label>
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
        <q-item-section style="max-width: 6rem">
          <q-item-label lines="1">
            <q-icon :name="$icon('origin')" size="xs" />
            <span class="text-caption text-grey-7 q-ml-xs">
              {{ $t('shipments.fields.origin') }}
            </span>
          </q-item-label>
        </q-item-section>
        <q-item-section>{{ item.origin }}</q-item-section>
      </q-item>
      <q-item>
        <q-item-section style="max-width: 6rem">
          <q-item-label lines="1">
            <q-icon :name="$icon('address')" size="xs" />
            <span class="text-caption text-grey-7 q-ml-xs">
              {{ $t('shipments.fields.originAddress') }}
            </span>
          </q-item-label>
        </q-item-section>
        <q-item-section>{{ item.originAddress }}</q-item-section>
      </q-item>
    </q-list>

    <q-separator />

    <!-- 納品先 -->
    <q-card-section class="q-py-sm">
      <div class="row items-center q-mb-xs">
        <q-icon :name="$icon('explorer')" size="xs" />
        <div class="text-caption text-primary q-ml-xs">
          {{ $t('shipments.fields.destination') }}
        </div>
      </div>
    </q-card-section>
    <q-list dense>
      <q-item>
        <q-item-section style="max-width: 6rem">
          <q-item-label lines="1">
            <q-icon :name="$icon('destination')" size="xs" />
            <span class="text-caption text-grey-7 q-ml-xs">
              {{ $t('shipments.fields.destination') }}
            </span>
          </q-item-label>
        </q-item-section>
        <q-item-section>{{ item.destination }}</q-item-section>
      </q-item>
      <q-item>
        <q-item-section style="max-width: 6rem">
          <q-item-label lines="1">
            <q-icon :name="$icon('address')" size="xs" />
            <span class="text-caption text-grey-7 q-ml-xs">
              {{ $t('shipments.fields.destinationAddress') }}
            </span>
          </q-item-label>
        </q-item-section>
        <q-item-section>{{ item.destinationAddress }}</q-item-section>
      </q-item>
    </q-list>

    <q-separator />

    <!-- 配送 -->
    <q-card-section class="q-py-sm">
      <div class="row items-center q-mb-xs">
        <q-icon :name="$icon('delivery')" size="xs" />
        <div class="text-caption text-primary q-ml-xs">{{ $t('delivery') }}</div>
      </div>
    </q-card-section>
    <q-list dense>
      <q-item>
        <q-item-section style="max-width: 6rem">
          <q-item-label lines="1">
            <q-icon :name="$icon('local-shipping')" size="xs" />
            <span class="text-caption text-grey-7 q-ml-xs">
              {{ $t('shipments.fields.carrierId') }}
            </span>
          </q-item-label>
        </q-item-section>
        <q-item-section>{{ carriersStore.nameById(item.carrierId) }}</q-item-section>
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
        <div class="row items-center">
          <q-item dense class="col-6" v-for="row in breakdownRows" :key="row.label">
            <q-item-section avatar>
              <q-icon :name="$icon(row.code)" size="xs" />
            </q-item-section>
            <q-item-section class="text-caption text-grey-7" style="max-width: 140px">
              {{ row.label }}
            </q-item-section>
            <q-item-section> {{ row.quantity }} {{ row.suffix }} </q-item-section>
          </q-item>
        </div>
      </q-card-section>
    </template>
  </q-card>
</template>
