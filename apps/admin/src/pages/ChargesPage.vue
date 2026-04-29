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
      <q-btn
        color="positive"
        size="sm"
        unelevated
        :icon="$icon('add')"
        :label="$t('labels.create')"
        @click="createPreset"
      />
    </q-card-actions>

    <q-card-section>
      <q-banner rounded class="bg-orange-1 text-orange-9">
        <template #avatar>
          <q-icon name="sym_o_construction" color="orange" />
        </template>
        工事中
      </q-banner>
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useConfirmAction } from 'composables/use-confirm-action'
import { useChargesStore } from 'stores/masters/charges'
import type { ChargeItem } from '@shisamo/shared'

const { t } = useI18n()
const { confirmAction } = useConfirmAction()
const chargesStore = useChargesStore()
const version = computed(() => chargesStore.list.length + 1)

const PRESET_ITEMS: ChargeItem[] = [
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
</script>
