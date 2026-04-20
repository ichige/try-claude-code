<template>
  <q-btn label="Open Dialog" @click="dialogFormStore.open()" />
</template>

<script setup lang="ts">
import { useDialogFormStore } from 'stores/dialog-form'

const dialogFormStore = useDialogFormStore()
</script>
