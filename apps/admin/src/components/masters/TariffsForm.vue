<template>
  <q-form ref="formRef" greedy>

    <!-- 基本情報: STEP1・STEP3 -->
    <template v-if="step !== 2">
      <!-- 説明文 -->
      <q-banner v-show="step === 1" class="bg-info text-white text-caption">
        <template #avatar>
          <q-avatar :icon="$icon('info')" />
        </template>
        <div>{{ $t('tariffs.step1.description') }}</div>
        <q-banner class="bg-warning text-black" rounded dense>{{ $t('tariffs.step1.example') }}</q-banner>
      </q-banner>

      <q-card-section class="row">
        <div class="col-12 row items-center q-mb-sm">
          <q-icon :name="$icon('name')" size="xs" />
          <div class="text-caption text-primary q-mr-sm">{{ $t('labels.basic') }}</div>
          <div class="col bg-grey-5" style="height: 1px;"></div>
        </div>

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
          class="col q-ml-md"
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
      <q-card-section class="">
        <div class="col-12 row items-center q-mb-sm">
          <q-icon :name="$icon('range')" size="xs" />
          <div class="text-caption text-primary q-mr-sm">{{ $t('tariffs.fields.ranges') }}</div>
          <div class="col bg-grey-5" style="height: 1px;"></div>
        </div>
        <div
          v-for="(range, idx) in draft.ranges"
          :key="idx"
          class="row items-center q-gutter-x-sm q-mb-sm"
        >
          <q-input
            :model-value="minKms[idx]"
            :label="$t('tariffs.fields.minKm')"
            type="number" outlined dense readonly
            class="col-5"
            input-class="text-right"
            suffix="km"
          />
          <span class="text-grey-6">〜</span>
          <q-input
            :model-value="range.maxKm"
            @update:model-value="val => updateMaxKm(idx, Number(val))"
            :label="$t('tariffs.fields.maxKm')"
            type="number" outlined dense
            class="col-5"
            input-class="text-right"
            suffix="km"
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
      <!-- 説明文 -->
      <q-banner v-show="step === 2" class="bg-info text-white text-caption">
        <template #avatar>
          <q-avatar icon="sym_o_info" />
        </template>
        <div>{{ $t('tariffs.step2.description') }}</div>
        <q-banner class="bg-warning text-black" rounded dense>{{ $t('tariffs.step2.example') }}</q-banner>
      </q-banner>

      <template v-for="(range, idx) in draft.ranges" :key="idx">
        <q-card-section>
          <div class="col-12 row items-center q-mb-sm">
            <q-icon :name="$icon('range')" size="xs" />
            <div class="text-caption text-primary q-mr-sm">{{ minKms[idx] }}km ～ {{ range.maxKm }}km</div>
            <div class="col bg-grey-5" style="height: 1px;"></div>
          </div>

          <div class="row items-center q-gutter-x-sm">

            <q-input
              :model-value="baseFares[idx]"
              @update:model-value="val => { if (idx === 0) draft.ranges[0]!.baseFare = Number(val) }"
              :label="$t('tariffs.fields.baseFare')"
              type="number"
              outlined
              dense
              class="col-4" input-class="text-right"
              :readonly="step === 3 || idx > 0"
              :rules="step === 2 ? [v => v >= 0 || $t('validation.numeric')] : []"
              prefix="&yen;"
            />
            <q-input
              v-model.number="range.unitKm"
              :label="$t('tariffs.fields.unitKm')"
              type="number"
              outlined
              dense
              class="col-3" input-class="text-right"
              :readonly="step === 3"
              :rules="step === 2 ? [v => v >= 1 || $t('validation.numeric')] : []"
              suffix="km"
            />
            <q-input
              v-model.number="range.unitFare"
              :label="$t('tariffs.fields.unitFare')"
              type="number"
              outlined
              dense
              class="col-4"
              input-class="text-right"
              :readonly="step === 3"
              :rules="step === 2 ? [v => v >= 0 || $t('validation.numeric')] : []"
              prefix="&yen;"
            />
          </div>
        </q-card-section>
        <q-separator v-if="idx < draft.ranges.length - 1" />
      </template>
    </template>

    <!-- 備考: STEP1・STEP3 -->
    <template v-if="step !== 2">
      <q-separator />
      <q-card-section>
        <div class="col-12 row items-center q-mb-sm">
          <q-icon :name="$icon('edit-note')" size="xs" />
          <div class="text-caption text-primary q-mr-sm">{{ $t('labels.other') }}</div>
          <div class="col bg-grey-5" style="height: 1px;"></div>
        </div>
        <q-input
          v-model="draft.notes"
          :label="$t('containers.fields.notes')"
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
import { ref, computed, inject } from 'vue'
import type { QForm } from 'quasar'
import { resolveIcon } from 'src/composables/use-icon'
import { tariffDraftKey, tariffStepKey, tariffVersionKey } from 'src/composables/tariff-draft'

const draft = inject(tariffDraftKey)!
const step = inject(tariffStepKey)!
const version = inject(tariffVersionKey)!

/**
 * 距離下限値の自動計算
 */
const minKms = computed(() =>
  draft.value.ranges.map((_, idx) =>
    idx === 0 ? 1 : draft.value.ranges[idx - 1]!.maxKm + 1
  )
)

/**
 * 距離上限値を変更することで、next の下限値を更新させる
 */
function updateMaxKm(idx: number, val: number): void {
  draft.value.ranges[idx]!.maxKm = val
  const next = draft.value.ranges[idx + 1]
  if (next) next.minKm = minKms.value[idx + 1]!
}

/**
 * レンジ追加
 */
function addRange(): void {
  const last = draft.value.ranges[draft.value.ranges.length - 1]
  const nextMin = last ? last.maxKm + 1 : 1
  const span = last ? last.maxKm - last.minKm : 19
  draft.value.ranges.push({ minKm: nextMin, maxKm: nextMin + span, baseFare: 0, unitKm: 1, unitFare: 0 })
}

/**
 * レンジ削除
 * @param idx
 */
function removeRange(idx: number): void {
  draft.value.ranges.splice(idx, 1)
  const affected = draft.value.ranges[idx]
  if (affected) affected.minKm = minKms.value[idx]!
}

/**
 * 基本料金の自動計算(2行目以降)
 */
const baseFares = computed(() =>
  draft.value.ranges.map((range, idx) => {
    if (idx === 0) return range.baseFare
    const prev = draft.value.ranges[idx - 1]!
    return prev.baseFare + Math.ceil((prev.maxKm + 1 - prev.minKm) / prev.unitKm) * prev.unitFare
  })
)

const simDistance = ref<number | null>(null)

const simulatedFare = computed<number | null>(() => {
  if (simDistance.value === null || simDistance.value <= 0) return null
  const idx = draft.value.ranges.findIndex((r, i) =>
    simDistance.value! >= minKms.value[i]! && simDistance.value! <= r.maxKm
  )
  if (idx === -1) return null
  const range = draft.value.ranges[idx]!
  const units = Math.ceil((simDistance.value - minKms.value[idx]!) / range.unitKm)
  return baseFares.value[idx]! + units * range.unitFare
})

const formRef = ref<InstanceType<typeof QForm> | null>(null)

defineExpose({ formRef })
</script>
