<template>
  <div>
    <div class="row justify-end q-mb-md">
      <q-btn color="primary" unelevated :icon="$icon('add')" :label="$t('labels.create')" @click="dialogOpen = true" />
    </div>

    <TariffsDialog v-model="dialogOpen" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import TariffsDialog from 'components/masters/TariffsDialog.vue'

const dialogOpen = ref(false)
</script>
