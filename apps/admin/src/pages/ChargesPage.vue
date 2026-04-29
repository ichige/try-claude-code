<template>
  <q-card flat bordered>
    <q-card-section class="q-pb-none">
      <q-avatar
        class="secondary-gradient q-mr-sm"
        :icon="$icon('masters-charges')"
        rounded
        size="md"
      />{{ $t('navi.masters-charges') }}
      <q-separator class="q-mt-sm" />
    </q-card-section>

    <q-card-actions class="q-py-sm">
      <q-btn-dropdown
        unelevated
        size="sm"
        color="primary"
        :label="$t('charges.labels.selection')"
      >
        <q-list>
          <q-item
            v-for="charge in chargesStore.list"
            :key="charge.id"
            clickable
            @click.stop="toggleSelect(charge)"
          >
            <q-item-section avatar>
              <q-toggle :model-value="isSelected(charge)" dense size="xs" @update:model-value="toggleSelect(charge)" />
            </q-item-section>
            <q-item-section>
              <q-item-label>
                <q-chip :label="charge.id" color="positive" square dense outline />
                {{ charge.name }}
              </q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </q-btn-dropdown>
      <q-separator vertical class="q-mx-sm" />
      <q-btn
        color="positive"
        size="sm"
        unelevated
        :icon="$icon('add')"
        :label="$t('labels.create')"
        @click="createPreset"
      />
    </q-card-actions>

    <q-card-section class="row q-col-gutter-sm">
      <div v-for="charge in selected" :key="charge.id" class="col-12">
        <q-table
          :rows="charge.items"
          :columns="columns"
          row-key="code"
          flat bordered
          table-header-class="bg-blue-grey-2 text-black"
        >
          <template #top>
            <div class="row items-center full-width q-gutter-x-sm">
              <div class="text-subtitle1 text-weight-bold">
                <q-badge color="positive" :label="charge.id" size="sm" outline />
                {{ charge.name }}
              </div>
              <!-- 運用状態(運用前|運用開始) -->
              <q-chip
                :color="charge.enabled ? 'positive' : 'primary'"
                text-color="white"
                size="sm"
                clickable
                square
                :disable="charge.enabled"
                @click="enable(charge)"
              >{{ charge.enabled ? $t('charges.labels.enabled') : $t('charges.labels.disabled') }}
              </q-chip>
              <!-- 利用状態(利用中|停止中) -->
              <q-toggle :model-value="charge.isActive" @click="toggleActive(charge)">
                <q-badge
                  :label="charge.isActive ? $t('charges.labels.active') : $t('charges.labels.inactive')"
                  :color="charge.isActive ? 'positive' : 'grey'"
                  text-color="white"
                  size="sm"
                  square
                />
              </q-toggle>
            </div>
          </template>

          <!-- 備考欄表示 -->
          <template #bottom>
            <q-banner class="full-width text-caption text-black bg-blue-grey-1" rounded>
              <template #avatar>
                <q-icon :name="$icon('format-quote')" color="grey" size="sm" />
              </template>
              {{ charge.notes }}
            </q-banner>
          </template>

          <!--suppress VueUnrecognizedSlot-->
          <template #body-cell-taxable="{ value }">
            <q-td class="text-center">
              <q-icon :name="value ? 'check' : 'remove'" :color="value ? 'positive' : 'grey'" />
            </q-td>
          </template>
          <!--suppress VueUnrecognizedSlot-->
          <template #body-cell-unitFare="{ value }">
            <q-td class="text-right">¥{{ value.toLocaleString() }}</q-td>
          </template>
        </q-table>
      </div>
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import type { QTableProps } from 'quasar'
import { useI18n } from 'vue-i18n'
import { useConfirmAction } from 'composables/use-confirm-action'
import { useChargesStore } from 'stores/masters/charges'
import type { ChargeItems } from '@shisamo/shared'

const { t } = useI18n()
const { confirmAction } = useConfirmAction()
const chargesStore = useChargesStore()

const version = computed(() => chargesStore.list.length + 1)
const selectedIds = ref(new Set(chargesStore.list.map(c => c.id)))
const selected = computed(() => chargesStore.list.filter(c => selectedIds.value.has(c.id)))

const PRESET_ITEMS = [
  { code: 'delivery-count', label: '配送件数',    unit: 'count',   taxable: true,  baseUnit: 1,  minUnit: 4, unitFare: 300, notes: '配送件数は4件から300円ずつ課金されます。' },
  { code: 'highway-fee',    label: '高速料金',    unit: 'yen',     taxable: false, baseUnit: 1,  minUnit: 1, unitFare: 1,   notes: '高速料金は非課税です。' },
  { code: 'waiting-time',   label: '待機時間',    unit: 'minutes', taxable: true,  baseUnit: 15, minUnit: 1, unitFare: 750, notes: '待機料金は15分単位で課金されます。' },
  { code: 'working-time',   label: '作業時間',    unit: 'minutes', taxable: true,  baseUnit: 15, minUnit: 1, unitFare: 750, notes: '作業料金は15分単位で課金されます。' },
  { code: 'parking-fee',    label: '駐車料金',    unit: 'yen',     taxable: false, baseUnit: 1,  minUnit: 1, unitFare: 1,   notes: '駐車料金は非課税です。' },
  { code: 'cancel-fee',     label: 'キャンセル料金', unit: 'yen',  taxable: true,  baseUnit: 1,  minUnit: 1, unitFare: 1,   notes: '稀にキャンセル料金が発生する場合があります。' },
  { code: 'flat-rate-fee',  label: '定額料金',    unit: 'yen',     taxable: true,  baseUnit: 1,  minUnit: 1, unitFare: 1,   notes: '定期的な配送などは、定額になる場合があります。' },
  { code: 'other-fee1',     label: 'その他',      unit: 'yen',     taxable: true,  baseUnit: 1,  minUnit: 1, unitFare: 1,   notes: 'その他例外的な料金です。' },
  { code: 'other-fee2',     label: 'その他',      unit: 'yen',     taxable: false, baseUnit: 1,  minUnit: 1, unitFare: 1,   notes: 'その他例外的な料金(非課税)です。' },
]

/**
 * @param charge - 対象の付帯料金マスタ
 */
function isSelected(charge: ChargeItems): boolean {
  return selectedIds.value.has(charge.id)
}

/**
 * @param charge - 対象の付帯料金マスタ
 */
function toggleSelect(charge: ChargeItems): void {
  if (selectedIds.value.has(charge.id)) selectedIds.value.delete(charge.id)
  else selectedIds.value.add(charge.id)
}

const columns: QTableProps['columns'] = [
  { name: 'code',     label: t('charges.fields.code'),     field: 'code',     align: 'left'   },
  { name: 'label',    label: t('charges.fields.label'),    field: 'label',    align: 'left'   },
  { name: 'unit',     label: t('charges.fields.unit'),     field: 'unit',     align: 'left'   },
  { name: 'taxable',  label: t('charges.fields.taxable'),  field: 'taxable',  align: 'center' },
  { name: 'baseUnit', label: t('charges.fields.baseUnit'), field: 'baseUnit', align: 'right'  },
  { name: 'minUnit',  label: t('charges.fields.minUnit'),  field: 'minUnit',  align: 'right'  },
  { name: 'unitFare', label: t('charges.fields.unitFare'), field: 'unitFare', align: 'right'  },
  { name: 'notes',    label: t('charges.fields.notes'),    field: 'notes',    align: 'left'   },
]

/**
 * プリセットを1件作成する。
 */
function createPreset(): void {
  confirmAction(
    t('charges.preset.title'),
    t('charges.preset.message'),
    () => chargesStore.create({
      id: `v${version.value}`,
      name: '標準',
      enabled: false,
      isActive: false,
      notes: '',
      items: PRESET_ITEMS,
    }),
  )
}

/**
 * 運用開始フラグを有効化する。一度有効にしたら無効には出来ない。
 * @param charge - 対象の付帯料金マスタ
 */
function enable(charge: ChargeItems): void {
  confirmAction(
    t('charges.enabled.title'),
    t('charges.enabled.message'),
    () => chargesStore.enable(charge),
  )
}

/**
 * 利用フラグを切り替える。
 * @param charge - 対象の付帯料金マスタ
 */
function toggleActive(charge: ChargeItems): void {
  const title = charge.isActive ? t('charges.active.titles.inactive') : t('charges.active.titles.active')
  const message = charge.isActive ? t('charges.active.messages.inactive') : t('charges.active.messages.active')
  confirmAction(title, message, () => chargesStore.toggleActive(charge))
}
</script>
