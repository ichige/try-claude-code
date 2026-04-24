<template>
  <q-table :rows="rows" :columns="columns" row-key="id">
    <template #top>
      <OpenDialogFormButton />
      <q-space />
      <ShowDeletedToggle />
    </template>
    <!--suppress VueUnrecognizedSlot slot名が解決出来ないけど、型としては正しい -->
    <template #body-cell-actions="props">
      <q-td :props="props">
        <q-btn flat dense icon="edit" color="primary" @click="openUpdateDialog(props.row)" />
        <q-btn v-if="!props.row.isDeleted" flat dense icon="delete" color="negative" @click="deleteRow(props.row)" />
        <q-btn v-if="props.row.isDeleted" flat dense icon="sym_o_restore_from_trash" color="warning" @click="restoreRow(props.row)" />
      </q-td>
    </template>
  </q-table>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useRoute, onBeforeRouteUpdate } from 'vue-router'
import type { ContainerName } from 'stores/masters'
import { useContainerTable, initContainerTable } from 'composables/masters/container-table'
import { useDialogFormActions, initDialogForm } from 'composables/dialog-form'

const route = useRoute()
const { rows, columns, ShowDeletedToggle } = useContainerTable()
const { OpenDialogFormButton, openUpdateDialog, deleteRow, restoreRow } = useDialogFormActions()

async function init(container: ContainerName): Promise<void> {
  await Promise.all([
    initContainerTable(container),
    initDialogForm(container),
  ])
}

onMounted(async () => {
  await init(route.params.container as ContainerName)
})

onBeforeRouteUpdate(async (to) => {
  await init(to.params.container as ContainerName)
})
</script>
