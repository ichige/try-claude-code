<template>
  <div class="row items-center no-wrap">
    <q-btn flat dense round icon="sym_o_chevron_left" size="sm" @click="prevMonth" />

    <q-btn flat dense no-caps :label="appStore.processingMonthLabel">
      <q-popup-proxy @before-show="syncYear">
        <q-card flat style="min-width: 224px">
          <q-card-section class="row items-center justify-between q-py-xs q-px-sm">
            <q-btn flat dense round icon="sym_o_chevron_left" @click.stop="prevYear" />
            <span class="text-subtitle2 text-weight-bold">{{ displayYear }}年</span>
            <q-btn flat dense round icon="sym_o_chevron_right" @click.stop="nextYear" />
          </q-card-section>

          <q-separator />

          <q-card-section class="q-pa-xs">
            <div class="row">
              <div v-for="m in 12" :key="m" class="col-3 q-pa-xs">
                <q-btn
                  v-close-popup
                  flat
                  dense
                  size="sm"
                  :color="isSelected(m) ? 'primary' : undefined"
                  :outline="isSelected(m)"
                  :label="`${m}月`"
                  class="full-width"
                  @click="selectMonth(m)"
                />
              </div>
            </div>
          </q-card-section>
        </q-card>
      </q-popup-proxy>
    </q-btn>

    <q-btn flat dense round icon="sym_o_chevron_right" size="sm" @click="nextMonth" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useAppStore } from 'stores/app'

const appStore = useAppStore()
const displayYear = ref(appStore.processingYear)

/** ポップアップを開く直前に表示年を処理月に合わせる */
function syncYear(): void {
  displayYear.value = appStore.processingYear
}

/**
 * @param month - 月 (1-12)
 * @returns 現在表示中の年月と一致するか
 */
function isSelected(month: number): boolean {
  return appStore.processingMonth === `${displayYear.value}${String(month).padStart(2, '0')}`
}

function prevYear(): void {
  displayYear.value--
}

function nextYear(): void {
  displayYear.value++
}

/**
 * @param month - 選択された月 (1-12)
 */
function selectMonth(month: number): void {
  appStore.processingMonth = `${displayYear.value}${String(month).padStart(2, '0')}`
}

function prevMonth(): void {
  const { processingYear: year, processingMonthNum: month } = appStore
  if (month === 1) {
    appStore.processingMonth = `${year - 1}12`
  } else {
    appStore.processingMonth = `${year}${String(month - 1).padStart(2, '0')}`
  }
}

function nextMonth(): void {
  const { processingYear: year, processingMonthNum: month } = appStore
  if (month === 12) {
    appStore.processingMonth = `${year + 1}01`
  } else {
    appStore.processingMonth = `${year}${String(month + 1).padStart(2, '0')}`
  }
}
</script>
