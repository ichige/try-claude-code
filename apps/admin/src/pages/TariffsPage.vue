<template>
  <div>
    <div class="row justify-end q-mb-md">
      <q-btn color="primary" unelevated :icon="$icon('add')" :label="$t('labels.create')" @click="dialogRef?.open" />
    </div>

    <TariffsDialog ref="dialogRef" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import TariffsDialog from 'components/masters/TariffsDialog.vue'

const dialogRef = ref<typeof TariffsDialog|null>(null)
</script>
