<template>
  <q-card flat bordered>
    <q-card-section class="q-pb-none">
      <q-avatar
        class="secondary-gradient q-mr-sm"
        :icon="$icon('masters-tariffs')"
        rounded
        size="md"
      />{{ $t('navi.masters-tariffs') }}
      <q-separator class="q-mt-sm" />
    </q-card-section>

    <q-card-actions class="q-py-sm">
      <q-btn-dropdown
        unelevated
        size="sm"
        color="primary"
        :label="$t('tariffs.labels.selection')"
      >
        <q-list>
          <q-item
            v-for="tariff in tariffsStore.list"
            :key="tariff.id"
            clickable
            @click.stop="toggleSelect(tariff)"
          >
            <q-item-section avatar>
              <q-toggle :model-value="isSelected(tariff)" dense @update:model-value="toggleSelect(tariff)" size="xs" />
            </q-item-section>
            <q-item-section>
              <q-item-label>
                <q-chip :label="tariff.id" color="positive" square dense outline />
                {{ tariff.name }}
              </q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </q-btn-dropdown>
      <q-separator vertical class="q-mx-sm" />
      <q-toggle v-model="twoColumns" :label="$t('labels.two-columns')" />
      <q-separator vertical class="q-mx-sm" />
      <q-btn
        color="positive"
        size="sm"
        unelevated
        :icon="$icon('add')"
        :label="$t('labels.create')"
        @click="dialogRef?.open"
      />
      <q-separator vertical class="q-mx-sm" />
      <q-input
        v-model.number="distance"
        :label="$t('tariffs.simulator.title')"
        dense
        outlined
        type="number"
        suffix="km"
        class="col-2"
        input-class="text-right"
      >
        <template #prepend>
          <q-icon :name="$icon('calculate')" />
        </template>
      </q-input>
    </q-card-actions>

    <q-card-section class="row q-col-gutter-sm">
      <div v-for="tariff in selected" :key="tariff.id" :class="twoColumns ? 'col-6' : 'col-12'">
        <q-table
          :rows="tariff.ranges"
          :columns="columns"
          row-key="minKm"
          flat bordered
          table-header-class="bg-blue-grey-2 text-black"
        >
          <template #top>
            <div class="row items-center full-width q-gutter-x-sm">
              <div class="text-subtitle1 text-weight-bold">
                <q-badge color="positive" :label="tariff.id" size="sm" outline />
                {{ tariff.name }}
              </div>
              <!-- 運用状態(運用前|運用開始) -->
              <q-chip
                :color="tariff.enabled ? 'positive' : 'primary'"
                text-color="white"
                size="sm"
                clickable
                square
                :disable="tariff.enabled"
                @click="enable(tariff)"
              >{{ tariff.enabled ? $t('tariffs.labels.enabled') : $t('tariffs.labels.disabled') }}
              </q-chip>
              <!-- 利用状態(利用中|停止中) -->
              <q-toggle :model-value="tariff.isActive" @click="toggleActive(tariff)">
                <q-badge
                  :label="tariff.isActive ? $t('tariffs.labels.active') : $t('tariffs.labels.inactive')"
                  :color="tariff.isActive ? 'positive' : 'grey'"
                  text-color="white"
                  size="sm"
                  square
                />
              </q-toggle>

              <!-- シミュレーター計算結果 -->
              <q-chip
                color="blue-grey-6"
                text-color="white"
                size="sm"
                square
              >
                <q-icon :name="$icon('calculate')" left />
                {{ fareOf(tariff) }}
              </q-chip>
              <q-space />
              <q-btn
                size="sm"
                unelevated
                color="primary"
                :disable="tariff.enabled"
                :icon="$icon('edit')"
                :label="$t('labels.update')"
                @click="edit(tariff)"
              />
            </div>
          </template>

          <!-- 備考欄表示 -->
          <template #bottom>
            <q-banner class="full-width text-caption text-black bg-blue-grey-1" rounded>
              <template #avatar>
                <q-icon :name="$icon('format-quote')" color="grey" size="sm" />
              </template>
              {{ tariff.notes }}
            </q-banner>
          </template>

          <!--suppress VueUnrecognizedSlot-->
          <template #body-cell-minKm="{ value }">
            <q-td class="text-right">{{ value }} km</q-td>
          </template>
          <!--suppress VueUnrecognizedSlot-->
          <template #body-cell-maxKm="{ value }">
            <q-td class="text-right">{{ value }} km</q-td>
          </template>
          <!--suppress VueUnrecognizedSlot-->
          <template #body-cell-baseFare="{ value }">
            <q-td class="text-right">¥{{ value.toLocaleString() }}</q-td>
          </template>
          <!--suppress VueUnrecognizedSlot-->
          <template #body-cell-unitKm="{ value }">
            <q-td class="text-right">{{ value }} km</q-td>
          </template>
          <!--suppress VueUnrecognizedSlot-->
          <template #body-cell-unitFare="{ value }">
            <q-td class="text-right">¥{{ value.toLocaleString() }}</q-td>
          </template>
        </q-table>
      </div>
    </q-card-section>

    <TariffsDialog ref="dialogRef" @created="selectedIds.add($event)" />
  </q-card>
</template>

<script setup lang="ts">
import { ref, computed, provide } from 'vue'
import { Loading, useQuasar } from 'quasar'
import type { QTableProps } from 'quasar'
import { useI18n } from 'vue-i18n'
import type { TariffsItem } from '@shisamo/shared'
import { useTariffsStore } from 'stores/masters/tariffs'
import TariffsDialog from 'components/masters/TariffsDialog.vue'
import { Tariff } from 'models/tariff'
import { tariffEditTargetKey } from 'components/masters/tariff-draft'

const { t } = useI18n()
const $q = useQuasar()
const tariffsStore = useTariffsStore()
const dialogRef = ref<InstanceType<typeof TariffsDialog> | null>(null)
const editTarget = ref<TariffsItem | null>(null)
provide(tariffEditTargetKey, editTarget)
const selectedIds = ref(new Set(tariffsStore.list.map(t => t.id)))
const selected = computed(() => tariffsStore.list.filter(t => selectedIds.value.has(t.id)))
const twoColumns = ref(false)
const distance = ref(0)

/**
 * 選択判定
 */
function isSelected(tariff: TariffsItem): boolean {
  return selectedIds.value.has(tariff.id)
}

/**
 * スイッチで選択状態を変更
 */
function toggleSelect(tariff: TariffsItem): void {
  if (selectedIds.value.has(tariff.id)) selectedIds.value.delete(tariff.id)
  else selectedIds.value.add(tariff.id)
}

/**
 * テーブル行の設定
 */
const columns: QTableProps['columns'] = [
  { name: 'minKm',    label: t('tariffs.fields.minKm'),    field: 'minKm',    align: 'right' },
  { name: 'maxKm',    label: t('tariffs.fields.maxKm'),    field: 'maxKm',    align: 'right' },
  { name: 'baseFare', label: t('tariffs.fields.baseFare'), field: 'baseFare', align: 'right' },
  { name: 'unitKm',   label: t('tariffs.fields.unitKm'),   field: 'unitKm',   align: 'right' },
  { name: 'unitFare', label: t('tariffs.fields.unitFare'), field: 'unitFare', align: 'right' },
]

/**
 * 運賃シミュレータ
 */
function fareOf(tariff: TariffsItem): string {
  const result = new Tariff(tariff).calculate(distance.value)
  return result !== null ? `¥${result.toLocaleString()}` : '-'
}

/**
 * 運用開始フラグを有効化する。一度有効にしたら無効には出来ない。
 * @param tariff - 対象の運賃表アイテム
 */
function enable(tariff: TariffsItem): void {
  $q.dialog({
    title: t('tariffs.enabled.title'),
    message: t('tariffs.enabled.message'),
    cancel: true,
    persistent: true,
  }).onOk(() => {
    void (async () => {
      Loading.show({ message: t('labels.loading') })
      try {
        await tariffsStore.enable(tariff)
      } finally {
        Loading.hide()
      }
    })()
  })
}

/**
 * 利用フラグを切り替える。
 * @param tariff - 対象の運賃表アイテム
 */
function toggleActive(tariff: TariffsItem): void {
  const message = tariff.isActive
    ? t('tariffs.active.messages.inactive')
    : t('tariffs.active.messages.active')
  $q.dialog({
    title: tariff.isActive ? t('tariffs.active.titles.inactive') : t('tariffs.active.titles.active'),
    message,
    cancel: true,
    persistent: true,
  }).onOk(() => {
    void (async () => {
      Loading.show({ message: t('labels.loading') })
      try {
        await tariffsStore.toggleActive(tariff)
      } finally {
        Loading.hide()
      }
    })()
  })
}

/**
 * 編集ダイアログを開く。
 * @param tariff - 編集対象の運賃表アイテム
 */
function edit(tariff: TariffsItem): void {
  editTarget.value = tariff
  dialogRef.value?.open()
}
</script>
