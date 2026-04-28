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
    </q-card-actions>

    <q-card-section class="row q-col-gutter-sm">
      <div v-for="tariff in selected" :key="tariff.id" :class="twoColumns ? 'col-6' : 'col-12'">
        <q-table
          :rows="tariff.ranges"
          :columns="columns"
          row-key="minKm"
          flat bordered
          hide-bottom
          table-header-class="bg-blue-grey-2"
        >
          <template #top>
            <div class="row items-center full-width q-gutter-x-sm">
              <div class="text-subtitle1 text-weight-bold">
                <q-chip :label="tariff.id" color="positive" size="sm" outline square />
                {{ tariff.name }}
              </div>
              <q-chip color="positive" text-color="white" size="sm" square dense>{{ $t('tariffs.labels.enabled') }}</q-chip>
              <q-chip color="negative" text-color="white" size="sm" square dense>{{ $t('tariffs.labels.disabled') }}</q-chip>
              <q-space />
              <q-btn size="sm" unelevated v-if="!tariff.enabled" color="primary" :label="$t('labels.use')" @click="enable(tariff)" />
              <q-btn size="sm" unelevated :color="tariff.disabled ? 'positive' : 'negative'" :label="tariff.disabled ? $t('labels.off') : $t('labels.off')" @click="toggleDisable(tariff)" />
              <q-btn size="sm" unelevated color="primary" :icon="$icon('edit')" :label="$t('labels.update')" @click="edit(tariff)" />
            </div>
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

    <TariffsDialog ref="dialogRef" />
  </q-card>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { QTableProps } from 'quasar'
import { useI18n } from 'vue-i18n'
import type { TariffsItem } from '@shisamo/shared'
import { useTariffsStore } from 'stores/masters/tariffs'
import TariffsDialog from 'components/masters/TariffsDialog.vue'

const { t } = useI18n()
const tariffsStore = useTariffsStore()
const dialogRef = ref<InstanceType<typeof TariffsDialog> | null>(null)
const selected = ref<TariffsItem[]>([])
const twoColumns = ref(false)

function isSelected(tariff: TariffsItem): boolean {
  return selected.value.some(s => s.id === tariff.id)
}

function toggleSelect(tariff: TariffsItem): void {
  const idx = selected.value.findIndex(s => s.id === tariff.id)
  if (idx === -1) selected.value.push(tariff)
  else selected.value.splice(idx, 1)
}

const columns: QTableProps['columns'] = [
  { name: 'minKm',    label: t('tariffs.fields.minKm'),    field: 'minKm',    align: 'right' },
  { name: 'maxKm',    label: t('tariffs.fields.maxKm'),    field: 'maxKm',    align: 'right' },
  { name: 'baseFare', label: t('tariffs.fields.baseFare'), field: 'baseFare', align: 'right' },
  { name: 'unitKm',   label: t('tariffs.fields.unitKm'),   field: 'unitKm',   align: 'right' },
  { name: 'unitFare', label: t('tariffs.fields.unitFare'), field: 'unitFare', align: 'right' },
]

function enable(_: TariffsItem): void {}
function toggleDisable(_: TariffsItem): void {}
function edit(_: TariffsItem): void {}
</script>
