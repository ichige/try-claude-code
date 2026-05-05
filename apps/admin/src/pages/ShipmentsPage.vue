<script setup lang="ts">
import { ref, computed } from 'vue'
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

const consignorId = computed(() => route.params.consignorId as string | undefined)

const rows = computed(() => {
  const all = shipmentsStore.list
  if (!consignorId.value) return all
  return all.filter((item) => item.consignorId === consignorId.value)
})


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
      </q-card-actions>

      <!-- 一覧テーブル -->
      <q-card-section>
        <q-table
          :rows="rows"
          :columns="columns"
          row-key="id"
          flat
          bordered
          :pagination="{ rowsPerPage: 20 }"
          table-header-class="bg-blue-grey-2 text-black"
          :no-data-label="$t('labels.noData')"
        >
          <!--suppress VueUnrecognizedSlot 走行距離 -->
          <template #body-cell-distance="{ value }">
            <q-td class="text-right">
              <span v-if="value !== null">{{ value }} km</span>
              <span v-else class="text-grey-4">―</span>
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
              <q-btn size="xs" :icon="$icon('edit')" color="info" unelevated @click="dialogRef?.openEdit(props.row)" />
              <q-btn size="xs" :icon="$icon('delete')" color="negative" unelevated disable />
            </q-td>
          </template>
        </q-table>
      </q-card-section>
    </q-card>

    <ShipmentsDialog ref="dialogRef" />
  </q-page>
</template>
