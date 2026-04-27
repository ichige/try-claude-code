<template>
  <!-- 基本情報 (readonly) -->
  <q-card-section class="row q-gutter-x-md">
    <q-input
      :model-value="version"
      :label="$t('tariffs.fields.version')"
      outlined dense readonly
      class="col-3"
    >
      <template #prepend>
        <q-icon :name="resolveIcon('version')" size="xs" />
      </template>
    </q-input>
    <q-input
      :model-value="draft.name"
      :label="$t('tariffs.fields.name')"
      outlined dense readonly
      class="col"
    >
      <template #prepend>
        <q-icon :name="resolveIcon('name')" size="xs" />
      </template>
    </q-input>
  </q-card-section>

  <q-separator />

  <!-- 運賃 (readonly、STEP2 準拠) -->
  <template v-for="(range, idx) in draft.ranges" :key="idx">
    <q-card-section>
      <div class="text-subtitle2 q-mb-sm">{{ range.minKm }}km ～ {{ range.maxKm }}km</div>
      <div class="row items-center q-gutter-x-sm">
        <span class="text-body2">{{ $t('tariffs.fields.baseFare') }}</span>
        <q-input :model-value="range.baseFare" type="number" outlined dense readonly class="col-3" input-class="text-right" />
        <span class="text-body2">円、</span>
        <q-input :model-value="range.unitKm" type="number" outlined dense readonly class="col-2" input-class="text-right" />
        <span class="text-body2">kmごとに</span>
        <q-input :model-value="range.unitFare" type="number" outlined dense readonly class="col-3" input-class="text-right" />
        <span class="text-body2">円加算</span>
      </div>
    </q-card-section>
    <q-separator v-if="idx < draft.ranges.length - 1" />
  </template>

  <q-separator />

  <!-- 備考 (編集可) -->
  <q-card-section>
    <q-input
      v-model="draft.notes"
      :label="$t('labels.other')"
      type="textarea"
      outlined dense
      rows="3"
    />
  </q-card-section>

  <q-separator />

  <!-- 計算シミュレータ -->
  <q-card-section>
    <div class="text-subtitle2 q-mb-sm">{{ $t('tariffs.simulator.title') }}</div>
    <div class="row items-center q-gutter-x-sm">
      <q-input
        v-model.number="simDistance"
        :label="$t('tariffs.simulator.distance')"
        type="number"
        outlined dense
        class="col-3"
        input-class="text-right"
      />
      <span class="text-body2">km →</span>
      <span v-if="simulatedFare !== null" class="text-h6">{{ simulatedFare.toLocaleString() }} 円</span>
      <span v-else-if="simDistance !== null" class="text-body2 text-grey">{{ $t('tariffs.simulator.outOfRange') }}</span>
    </div>
  </q-card-section>
</template>

<script setup lang="ts">
import { ref, computed, inject } from 'vue'
import { resolveIcon } from 'src/composables/use-icon'
import { tariffDraftKey } from 'src/composables/tariff-draft'

defineProps<{ version: number }>()

const draft = inject(tariffDraftKey)!

const simDistance = ref<number | null>(null)

const simulatedFare = computed<number | null>(() => {
  if (simDistance.value === null || simDistance.value <= 0) return null
  const range = draft.ranges.find(r => simDistance.value! >= r.minKm && simDistance.value! <= r.maxKm)
  if (!range) return null
  const units = Math.ceil((simDistance.value - range.minKm) / range.unitKm)
  return range.baseFare + units * range.unitFare
})
</script>
