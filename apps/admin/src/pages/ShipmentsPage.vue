<template>
  <q-page class="q-pa-md">
    <q-card flat bordered>
      <q-card-section class="q-pb-none">
        <q-avatar
          class="secondary-gradient q-mr-sm"
          :icon="$icon('shipments')"
          rounded
          size="md"
        />{{ $t('navi.shipments') }}
        <q-chip v-if="consignorId" color="primary" text-color="white" size="sm" square class="q-ml-sm">
          {{ consignorId }}
        </q-chip>
        <q-separator class="q-mt-sm" />
      </q-card-section>

      <q-card-actions class="q-py-sm">
        <q-btn
          color="positive"
          size="sm"
          unelevated
          :icon="$icon('add')"
          :label="$t('labels.create')"
          @click="dialogRef?.open()"
        />
      </q-card-actions>

      <q-card-section class="row items-center justify-center" style="min-height: 200px">
        <div class="text-h6 text-grey-5">工事中</div>
      </q-card-section>
    </q-card>

    <ShipmentsDialog ref="dialogRef" />
  </q-page>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import ShipmentsDialog from 'components/shipments/ShipmentsDialog.vue'

const route = useRoute()
const dialogRef = ref<InstanceType<typeof ShipmentsDialog> | null>(null)

const consignorId = computed(() => route.params.consignorId as string | undefined)
</script>
