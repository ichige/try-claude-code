<template>
  <q-form ref="formRef" greedy>

    <template v-for="(range, idx) in draft.ranges" :key="idx">
      <q-card-section>
        <div class="text-subtitle2 q-mb-sm">{{ range.minKm }}km ～ {{ range.maxKm }}km</div>
        <div class="row items-center q-gutter-x-sm">
          <span class="text-body2">{{ $t('tariffs.fields.baseFare') }}</span>
          <q-input
            v-model.number="range.baseFare"
            type="number"
            outlined dense
            class="col-3"
            input-class="text-right"
            :readonly="idx > 0"
            :rules="[v => v >= 0 || $t('validation.numeric')]"
          />
          <span class="text-body2">円、</span>
          <q-input
            v-model.number="range.unitKm"
            type="number"
            outlined dense
            class="col-2"
            input-class="text-right"
            :rules="[v => v >= 1 || $t('validation.numeric')]"
          />
          <span class="text-body2">kmごとに</span>
          <q-input
            v-model.number="range.unitFare"
            type="number"
            outlined dense
            class="col-3"
            input-class="text-right"
            :rules="[v => v >= 0 || $t('validation.numeric')]"
          />
          <span class="text-body2">円加算</span>
        </div>
      </q-card-section>
      <q-separator v-if="idx < draft.ranges.length - 1" />
    </template>

  </q-form>
</template>

<script setup lang="ts">
import { ref, watch, inject } from 'vue'
import type { QForm } from 'quasar'
import { tariffDraftKey } from 'src/composables/tariff-draft'

const draft = inject(tariffDraftKey)!

watch(
  draft.ranges,
  () => {
    for (let i = 1; i < draft.ranges.length; i++) {
      const prev = draft.ranges[i - 1]!
      const auto = prev.baseFare + Math.ceil((prev.maxKm + 1 - prev.minKm) / prev.unitKm) * prev.unitFare
      if (draft.ranges[i]!.baseFare !== auto) draft.ranges[i]!.baseFare = auto
    }
  },
  { deep: true },
)

const formRef = ref<InstanceType<typeof QForm> | null>(null)

defineExpose({ formRef })
</script>
