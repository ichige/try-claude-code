<template>
  <q-form ref="formRef" greedy>

    <q-card-section class="row q-gutter-x-md">
      <!-- バージョン（自動採番・読み取り専用） -->
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

      <!-- 運賃表の名前 -->
      <q-input
        v-model="draft.name"
        :label="$t('tariffs.fields.name')"
        outlined dense
        class="col"
      >
        <template #prepend>
          <q-icon :name="resolveIcon('name')" size="xs" />
        </template>
      </q-input>
    </q-card-section>

    <q-separator />

    <!-- 距離レンジ -->
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
          type="number"
          outlined dense
          class="col-5"
        />
        <span class="text-grey-6">〜</span>
        <q-input
          v-model.number="range.maxKm"
          :label="$t('tariffs.fields.maxKm')"
          type="number"
          outlined dense
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

    <q-separator />

    <!-- 備考 -->
    <q-card-section>
      <q-input
        v-model="draft.notes"
        :label="$t('labels.other')"
        type="textarea"
        outlined dense
        rows="3"
      />
    </q-card-section>

  </q-form>
</template>

<script setup lang="ts">
import { ref, inject } from 'vue'
import type { QForm } from 'quasar'
import { resolveIcon } from 'src/composables/use-icon'
import { tariffDraftKey } from 'src/composables/tariff-draft'

defineProps<{ version: number }>()

const draft = inject(tariffDraftKey)!

function addRange(): void {
  const last = draft.ranges[draft.ranges.length - 1]
  const nextMin = last ? last.maxKm + 1 : 1
  const span = last ? last.maxKm - last.minKm : 19
  draft.ranges.push({ minKm: nextMin, maxKm: nextMin + span, baseFare: 0, unitKm: 1, unitFare: 0 })
}

function removeRange(idx: number): void {
  draft.ranges.splice(idx, 1)
}

const formRef = ref<InstanceType<typeof QForm> | null>(null)

defineExpose({ formRef })
</script>
