<template>
  <q-table :rows="rows" :columns="columns" row-key="id">
    <template #top>
      <OpenDialogFormButton />
    </template>
  </q-table>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useRoute, onBeforeRouteUpdate } from 'vue-router'
import type { ContainerName } from 'stores/masters'
import { useContainerTable, initContainerTable } from 'composables/masters/container-table'
import { useDialogFormButton, initDialogForm } from 'composables/dialog-form'

const route = useRoute()
const { rows, columns } = useContainerTable()
const { OpenDialogFormButton } = useDialogFormButton()

async function init(container: ContainerName): Promise<void> {
  await Promise.all([
    initContainerTable(container),
    initDialogForm(container, 'create'),
  ])
}

onMounted(async () => {
  await init(route.params.container as ContainerName)
})

onBeforeRouteUpdate(async (to) => {
  await init(to.params.container as ContainerName)
})
</script>
