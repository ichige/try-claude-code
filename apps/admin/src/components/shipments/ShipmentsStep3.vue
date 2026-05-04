<script setup lang="ts">
import { computed, inject } from 'vue'
import type { ShipmentBreakdown } from '@shisamo/shared'
import type { BreakdownDef } from 'src/configs/shipments/breakdown'
import { shipmentDraftKey } from './shipment-draft'
import { BREAKDOWN_DEFS } from 'src/configs/shipments/breakdown'
import { toNonNegative } from 'src/utils/clamp'

const draft = inject(shipmentDraftKey)!

const rows = computed(() =>
  BREAKDOWN_DEFS.map((def) => ({
    def,
    item: draft.value.breakdown.find((b) => b.code === def.code),
  })).filter(
    (row): row is { def: BreakdownDef; item: ShipmentBreakdown } => row.item !== undefined,
  ),
)
</script>

<template>
  <q-card-section>
    <div class="row q-col-gutter-sm">
      <q-input
        v-for="row in rows"
        :key="row.def.code"
        :model-value="row.item.quantity"
        :label="row.def.label"
        :suffix="row.def.suffix"
        type="number"
        min="0"
        outlined
        dense
        class="col-6"
        input-class="text-right"
        @update:model-value="(v) => (row.item.quantity = toNonNegative(v))"
      >
        <template v-slot:prepend>
          <q-icon :name="$icon(row.def.code)" size="xs" />
        </template>
      </q-input>
    </div>
  </q-card-section>
</template>
