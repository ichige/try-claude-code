<template>
  <q-table
    :rows="rows"
    :columns="columns"
    row-key="id"
    :filter="filter"
    table-header-class="bg-blue-grey-1 text-black"
  >
    <template #top>
      <div class="full-width q-mb-sm text-weight-bold">
        <div class="row items-center">
          <q-avatar
            class="secondary-gradient q-mr-sm"
            :icon="meta.icon"
            size="md"
            text-color="white"
            rounded
          />
          {{ $t(meta.titleKey) }}
          <q-space />
          <q-input v-model="filter" :placeholder="$t('labels.search')" dense outlined clearable>
            <template #prepend>
              <q-icon :name="$icon('search')" />
            </template>
          </q-input>
        </div>
        <q-separator class="q-mt-sm" />
      </div>

      <div class="q-mx-xs">
        <OpenDialogFormButton />
      </div>
      <q-space />
      <ShowDeletedToggle />
    </template>

    <!--suppress VueUnrecognizedSlot slot名が解決出来ないけど、型としては正しい -->
    <template #body-cell-actions="props">
      <q-td :props="props" class="q-gutter-x-sm">
        <q-btn size="xs" :icon="$icon('edit')" color="info" @click="openUpdateDialog(props.row)" unelevated />
        <q-btn v-if="!props.row.isDeleted" size="xs" :icon="$icon('delete')" color="negative" @click="deleteRow(props.row)" unelevated />
        <q-btn v-if="props.row.isDeleted" size="xs" :icon="$icon('restore')" color="warning" @click="restoreRow(props.row)" unelevated />
      </q-td>
    </template>
  </q-table>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, onBeforeRouteUpdate } from 'vue-router'
import type { ContainerName } from 'stores/masters'
import { useContainerTable, initContainerTable } from 'composables/masters/container-table'
import { useDialogFormActions, initDialogForm } from 'composables/dialog-form'

const filter = ref('')

const route = useRoute()
const { rows, columns, meta, ShowDeletedToggle } = useContainerTable()
const { OpenDialogFormButton, openUpdateDialog, deleteRow, restoreRow } = useDialogFormActions()

/**
 * テーブル情報のビルド ＆ 入力フォームの初期化
 * @param container
 */
async function init(container: ContainerName): Promise<void> {
  await Promise.all([
    initContainerTable(container),
    initDialogForm(container),
  ])
}

/**
 * マウント時の初期化
 */
onMounted(async () => {
  await init(route.params.container as ContainerName)
})

/**
 * URLパラメータ変更での初期化
 */
onBeforeRouteUpdate(async (to) => {
  await init(to.params.container as ContainerName)
})
</script>
