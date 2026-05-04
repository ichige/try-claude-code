<script setup lang="ts">
import { computed, inject } from 'vue'
import type { ShipmentBreakdown } from '@shisamo/shared'
import type { BreakdownDef } from 'src/configs/shipments/breakdown'
import { shipmentDraftKey } from './shipment-draft'
import { BREAKDOWN_DEFS } from 'src/configs/shipments/breakdown'

const draft = inject(shipmentDraftKey)!

const rows = computed(() =>
  BREAKDOWN_DEFS
    .map((def) => ({ def, item: draft.value.breakdown.find((b) => b.code === def.code) }))
    .filter((row): row is { def: BreakdownDef; item: ShipmentBreakdown } => row.item !== undefined),
)
</script>

<template>
  <q-card-section>
    <div class="row q-col-gutter-sm">
      <q-input
        v-for="row in rows"
        :key="row.def.code"
        v-model.number="row.item.quantity"
        :label="row.def.label"
        :suffix="row.def.suffix"
        type="number"
        outlined
        dense
        class="col-6"
      />
    </div>
  </q-card-section>
</template>
