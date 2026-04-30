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
          :pagination="{ rowsPerPage: 10 }"
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
          <template #body-cell-label="{ row }">
            <q-td>
              {{ row.label }}
              <InlineEditPopup :model-value="row.label" :disable="charge.enabled" @save="(val) => updateItemField(charge, row.code, 'label', val)" />
            </q-td>
          </template>
          <!--suppress VueUnrecognizedSlot-->
          <template #body-cell-notes="{ row }">
            <q-td>
              {{ row.notes }}
              <InlineEditPopup type="textarea" :model-value="row.notes" :disable="charge.enabled" @save="(val) => updateItemField(charge, row.code, 'notes', val)" />
            </q-td>
          </template>
          <!--suppress VueUnrecognizedSlot-->
          <template #body-cell-taxable="{ value }">
            <q-td class="text-center">
              <q-icon :name="value ? 'check' : 'remove'" :color="value ? 'positive' : 'grey'" />
            </q-td>
          </template>
          <!--suppress VueUnrecognizedSlot-->
          <template #body-cell-baseUnit="{ row }">
            <q-td class="text-right">
              {{ row.baseUnit }}
              <InlineEditPopup v-if="row.unit === 'minutes'" type="number" :model-value="row.baseUnit" :disable="charge.enabled" @save="(val) => updateItemField(charge, row.code, 'baseUnit', val)" />
            </q-td>
          </template>
          <!--suppress VueUnrecognizedSlot-->
          <template #body-cell-minUnit="{ row }">
            <q-td class="text-right">
              {{ row.minUnit }}
              <InlineEditPopup v-if="row.unit === 'count'" type="number" :model-value="row.minUnit" :disable="charge.enabled" @save="(val) => updateItemField(charge, row.code, 'minUnit', val)" />
            </q-td>
          </template>
          <!--suppress VueUnrecognizedSlot-->
          <template #body-cell-unitFare="{ row }">
            <q-td class="text-right">
              ¥{{ row.unitFare.toLocaleString() }}
              <InlineEditPopup v-if="row.unit !== 'yen'" type="number" :model-value="row.unitFare" :disable="charge.enabled" @save="(val) => updateItemField(charge, row.code, 'unitFare', val)" />
            </q-td>
          </template>
        </q-table>
      </div>
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { Loading } from 'quasar'
import { useI18n } from 'vue-i18n'
import { useConfirmAction } from 'composables/use-confirm-action'
import { useChargesStore } from 'stores/masters/charges'
import type { ChargeItems } from '@shisamo/shared'
import InlineEditPopup from 'components/InlineEditPopup.vue'
import { columns, PRESET_ITEMS } from 'configs/masters/charges'

const { t } = useI18n()
const { confirmAction } = useConfirmAction()
const chargesStore = useChargesStore()

const version = computed(() => chargesStore.list.length + 1)
const selectedIds = ref(new Set(chargesStore.list.map(c => c.id)))
const selected = computed(() => chargesStore.list.filter(c => selectedIds.value.has(c.id)))


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
 * 指定行の文字列フィールドを更新する。
 * @param charge - 対象の付帯料金マスタ
 * @param code - 更新対象の種別コード
 * @param field - 更新するフィールド名
 * @param value - 新しい値
 */
async function updateItemField(charge: ChargeItems, code: string, field: 'label' | 'notes' | 'baseUnit' | 'minUnit' | 'unitFare', value: string | number): Promise<void> {
  Loading.show()
  try {
    const items = charge.items.map(item =>
      item.code === code ? { ...item, [field]: value } : item
    )
    await chargesStore.update(charge.id, { ...charge, items })
  } finally {
    Loading.hide()
  }
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
