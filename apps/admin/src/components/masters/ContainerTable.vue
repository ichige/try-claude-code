<template>
  <q-table :rows="rows" :columns="columns" row-key="id" />
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useRoute } from 'vue-router'
import type { ContainerName } from 'stores/masters'
import { useContainerTable, initContainerTable } from 'composables/masters/container-table'

const route = useRoute()
const { rows, columns } = useContainerTable()

onMounted(async () => {
  await initContainerTable(route.params.container as ContainerName)
})
</script>
