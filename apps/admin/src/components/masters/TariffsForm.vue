<template>
  <q-form ref="formRef" greedy>

    <!-- 基本情報: STEP1・STEP3 -->
    <template v-if="step !== 2">
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
          v-model="draft.name"
          :label="$t('tariffs.fields.name')"
          outlined dense
          :readonly="step === 3"
          class="col"
        >
          <template #prepend>
            <q-icon :name="resolveIcon('name')" size="xs" />
          </template>
        </q-input>
      </q-card-section>
      <q-separator />
    </template>

    <!-- 距離レンジ: STEP1 (まとめて一セクション) -->
    <template v-if="step === 1">
      <q-card-section>
        <div class="text-subtitle2 q-mb-sm">{{ $t('tariffs.fields.ranges') }}</div>
        <div
          v-for="(range, idx) in draft.ranges"
          :key="idx"
          class="row items-center q-gutter-x-sm q-mb-sm"
        >
          <q-input
            v-model.number="range.minKm"
            :label="$t('tariffs.fields.minKm')"
            type="number" outlined dense
            class="col-5"
          />
          <span class="text-grey-6">〜</span>
          <q-input
            v-model.number="range.maxKm"
            :label="$t('tariffs.fields.maxKm')"
            type="number" outlined dense
            class="col-5"
          />
          <q-btn
            flat round dense
            :icon="resolveIcon('remove')"
            color="negative"
            :disable="draft.ranges.length === 1"
            @click="removeRange(idx)"
          />
        </div>
        <q-btn
          flat
          :icon="resolveIcon('add')"
          :label="$t('labels.add')"
          color="primary"
          :disable="draft.ranges.length >= 100"
          @click="addRange"
        />
      </q-card-section>
    </template>

    <!-- 距離レンジ + 運賃: STEP2・STEP3 (レンジごとにセクション) -->
    <template v-if="step !== 1">
      <template v-for="(range, idx) in draft.ranges" :key="idx">
        <q-card-section>
          <div class="text-subtitle2 q-mb-sm">{{ range.minKm }}km ～ {{ range.maxKm }}km</div>
          <div class="row items-center q-gutter-x-sm">
            <span class="text-body2">{{ $t('tariffs.fields.baseFare') }}</span>
            <q-input
              v-model.number="range.baseFare"
              type="number" outlined dense
              class="col-3" input-class="text-right"
              :readonly="step === 3 || idx > 0"
              :rules="step === 2 ? [v => v >= 0 || $t('validation.numeric')] : []"
            />
            <span class="text-body2">円、</span>
            <q-input
              v-model.number="range.unitKm"
              type="number" outlined dense
              class="col-2" input-class="text-right"
              :readonly="step === 3"
              :rules="step === 2 ? [v => v >= 1 || $t('validation.numeric')] : []"
            />
            <span class="text-body2">kmごとに</span>
            <q-input
              v-model.number="range.unitFare"
              type="number" outlined dense
              class="col-3" input-class="text-right"
              :readonly="step === 3"
              :rules="step === 2 ? [v => v >= 0 || $t('validation.numeric')] : []"
            />
            <span class="text-body2">円加算</span>
          </div>
        </q-card-section>
        <q-separator v-if="idx < draft.ranges.length - 1" />
      </template>
    </template>

    <!-- 備考: STEP1・STEP3 -->
    <template v-if="step !== 2">
      <q-separator />
      <q-card-section>
        <q-input
          v-model="draft.notes"
          :label="$t('labels.other')"
          type="textarea" outlined dense
          rows="3"
        />
      </q-card-section>
    </template>

    <!-- 計算シミュレータ: STEP3 -->
    <template v-if="step === 3">
      <q-separator />
      <q-card-section>
        <div class="text-subtitle2 q-mb-sm">{{ $t('tariffs.simulator.title') }}</div>
        <div class="row items-center q-gutter-x-sm">
          <q-input
            v-model.number="simDistance"
            :label="$t('tariffs.simulator.distance')"
            type="number" outlined dense
            class="col-3" input-class="text-right"
          />
          <span class="text-body2">km →</span>
          <span v-if="simulatedFare !== null" class="text-h6">{{ simulatedFare.toLocaleString() }} 円</span>
          <span v-else-if="simDistance !== null" class="text-body2 text-grey">{{ $t('tariffs.simulator.outOfRange') }}</span>
        </div>
      </q-card-section>
    </template>

  </q-form>
</template>

<script setup lang="ts">
import { ref, watch, computed, inject } from 'vue'
import type { QForm } from 'quasar'
import { resolveIcon } from 'src/composables/use-icon'
import { tariffDraftKey, tariffStepKey, tariffVersionKey } from 'src/composables/tariff-draft'

const draft = inject(tariffDraftKey)!
const step = inject(tariffStepKey)!
const version = inject(tariffVersionKey)!

function addRange(): void {
  const last = draft.ranges[draft.ranges.length - 1]
  const nextMin = last ? last.maxKm + 1 : 1
  const span = last ? last.maxKm - last.minKm : 19
  draft.ranges.push({ minKm: nextMin, maxKm: nextMin + span, baseFare: 0, unitKm: 1, unitFare: 0 })
}

function removeRange(idx: number): void {
  draft.ranges.splice(idx, 1)
}

watch(
  draft.ranges,
  () => {
    if (step.value !== 2) return
    for (let i = 1; i < draft.ranges.length; i++) {
      const prev = draft.ranges[i - 1]!
      const auto = prev.baseFare + Math.ceil((prev.maxKm + 1 - prev.minKm) / prev.unitKm) * prev.unitFare
      if (draft.ranges[i]!.baseFare !== auto) draft.ranges[i]!.baseFare = auto
    }
  },
  { deep: true },
)

const simDistance = ref<number | null>(null)

const simulatedFare = computed<number | null>(() => {
  if (simDistance.value === null || simDistance.value <= 0) return null
  const range = draft.ranges.find(r => simDistance.value! >= r.minKm && simDistance.value! <= r.maxKm)
  if (!range) return null
  const units = Math.ceil((simDistance.value - range.minKm) / range.unitKm)
  return range.baseFare + units * range.unitFare
})

const formRef = ref<InstanceType<typeof QForm> | null>(null)

defineExpose({ formRef })
</script>
