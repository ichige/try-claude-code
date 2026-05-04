<script setup lang="ts">
import { inject } from 'vue'
import { shipmentDraftKey } from './shipment-draft'
import ShipmentCard from './ShipmentCard.vue'

const draft = inject(shipmentDraftKey)!
</script>

<template>
  <div class="q-gutter-y-sm">
    <ShipmentCard :item="draft" />
    <q-input
      v-model="draft.notes"
      :label="$t('shipments.fields.notes')"
      type="textarea"
      outlined
      dense
      autogrow
    >
      <template v-slot:prepend>
        <q-icon :name="$icon('other')" />
      </template>
    </q-input>
  </div>
</template>
