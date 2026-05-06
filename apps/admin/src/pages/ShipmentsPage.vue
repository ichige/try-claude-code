<script setup lang="ts">
import { ref, computed } from 'vue'
import type { ShipmentStatus } from '@shisamo/shared'
import { useRoute } from 'vue-router'
import { useShipmentsStore } from 'stores/shipments'
import { useConsignorsStore } from 'stores/masters/consignors'
import { useShipmentsColumns } from 'composables/shipments/use-shipments-columns'
import ShipmentsDialog from 'components/shipments/ShipmentsDialog.vue'

const route = useRoute()
const shipmentsStore = useShipmentsStore()
const consignorsStore = useConsignorsStore()
const { columns } = useShipmentsColumns()

const dialogRef = ref<InstanceType<typeof ShipmentsDialog> | null>(null)
const filter = ref('')

/** URLパスの取引ID(オプション) */
const consignorId = computed(() => route.params.consignorId as string | undefined)

/**
 * テーブル表示対象のフィルタ
 * URLで取引先IDでの絞り込みあり
 */
const rows = computed(() => {
  const all = shipmentsStore.list
  if (!consignorId.value) return all
  return all.filter((item) => item.consignorId === consignorId.value)
})

/** status の表示色 */
const STATUS_COLORS: Record<ShipmentStatus, string> = {
  new: 'blue-grey',
  assigned: 'primary',
  submitted: 'warning',
  completed: 'positive',
  reverted: 'negative',
}

/**
 * @param status - 取引ステータス
 * @returns Quasar カラー名
 */
function statusColor(status: ShipmentStatus): string {
  return STATUS_COLORS[status] ?? 'grey'
}
</script>

<template>
  <q-page class="q-pa-md">
    <q-card flat bordered>
      <!-- 見出し -->
      <q-card-section class="q-pb-none">
        <q-avatar class="secondary-gradient q-mr-sm" :icon="$icon('shipments')" rounded size="md" />
        {{ $t('navi.shipments') }}
        <q-chip
          v-if="consignorId"
          color="primary"
          text-color="white"
          size="sm"
          square
          class="q-ml-sm"
        >
          {{ consignorsStore.nameById(consignorId) }}
        </q-chip>
        <q-separator class="q-mt-sm" />
      </q-card-section>

      <!-- アクション -->
      <q-card-actions class="q-py-sm">
        <q-btn
          color="positive"
          size="sm"
          unelevated
          :icon="$icon('add')"
          :label="$t('labels.create')"
          @click="dialogRef?.open()"
        />
        <q-space />
        <q-input v-model="filter" :placeholder="$t('labels.search')" dense outlined clearable>
          <template #prepend>
            <q-icon :name="$icon('search')" />
          </template>
        </q-input>
      </q-card-actions>

      <!-- 一覧テーブル -->
      <q-card-section>
        <q-table
          :rows="rows"
          :columns="columns"
          :filter="filter"
          row-key="id"
          flat
          bordered
          :pagination="{ rowsPerPage: 20 }"
          table-header-class="bg-blue-grey-2 text-black"
          :no-data-label="$t('labels.noData')"
        >
          <!--suppress VueUnrecognizedSlot 共通ヘッダセル -->
          <template #header-cell="props">
            <q-th>
              <q-icon :name="$icon(props.col.name)" size="xs" class="q-mr-xs" />
              <span>{{ props.col.label }}</span>
            </q-th>
          </template>
          <!--suppress VueUnrecognizedSlot 走行距離 -->
          <template #body-cell-distance="{ value }">
            <q-td class="text-right">
              <span v-if="value !== null">{{ value }} km</span>
              <span v-else class="text-grey-4">―</span>
            </q-td>
          </template>

          <!--suppress VueUnrecognizedSlot ステータス -->
          <template #body-cell-status="{ value }">
            <q-td class="text-center">
              <q-chip :color="statusColor(value)" text-color="white" size="sm" square dense>{{
                $t(`shipments.status.${value}`)
              }}</q-chip>
            </q-td>
          </template>

          <!--suppress VueUnrecognizedSlot 備考(省略表示) -->
          <template #body-cell-notes="{ value }">
            <q-td style="max-width: 180px">
              <div class="ellipsis">{{ value }}</div>
              <q-tooltip v-if="value">{{ value }}</q-tooltip>
            </q-td>
          </template>

          <!--suppress VueUnrecognizedSlot アクション -->
          <template #body-cell-actions="props">
            <q-td :props="props" class="q-gutter-x-sm">
              <q-btn
                size="xs"
                :icon="$icon('edit')"
                color="info"
                unelevated
                @click="dialogRef?.openEdit(props.row)"
              />
              <q-btn size="xs" :icon="$icon('delete')" color="negative" unelevated disable />
            </q-td>
          </template>
        </q-table>
      </q-card-section>
    </q-card>

    <ShipmentsDialog ref="dialogRef" />
  </q-page>
</template>
