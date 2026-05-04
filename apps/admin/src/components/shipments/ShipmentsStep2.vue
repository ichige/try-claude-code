<script setup lang="ts">
import { ref, computed, inject } from 'vue'
import type { QForm } from 'quasar'
import { useCarriersStore } from 'stores/masters/carriers'
import { zodRule } from 'src/utils/zod-rule'
import { shipmentDraftKey } from './shipment-draft'
import ListSelectBtn from 'src/components/ListSelectBtn.vue'
import { step2Schema } from 'src/configs/shipments/schemas'

const draft = inject(shipmentDraftKey)!
const carriersStore = useCarriersStore()
const formRef = ref<InstanceType<typeof QForm> | null>(null)


const carrierOptions = computed(() =>
  carriersStore.list.map((c) => ({ label: c.companyName, value: c.id })),
)

const carrierName = computed(
  () => carriersStore.list.find((c) => c.id === draft.value.carrierId)?.companyName ?? '',
)

defineExpose({ formRef })
</script>

<template>
  <q-form ref="formRef" greedy>
    <q-card-section>
      <div class="col-12 row items-center q-mb-sm">
        <q-icon :name="$icon('masters-container.carriers')" size="xs" />
        <div class="text-caption text-primary q-mr-sm">{{ $t('shipments.fields.carrierId') }}</div>
        <div class="col bg-grey-5" style="height: 1px" />
      </div>
      <div class="row q-col-gutter-sm">
        <q-input
          :model-value="carrierName"
          :label="$t('shipments.fields.carrierId')"
          outlined
          dense
          readonly
          :rules="[(_val) => zodRule(step2Schema.shape.carrierId)(draft.carrierId)]"
          class="col-6"
        >
          <template #before>
            <ListSelectBtn
              :options="carrierOptions"
              @select="(val) => (draft.carrierId = val)"
            />
          </template>
          <template #prepend>
            <q-icon :name="$icon('masters-container.carriers')" size="xs" />
          </template>
        </q-input>
      </div>
    </q-card-section>
  </q-form>
</template>
