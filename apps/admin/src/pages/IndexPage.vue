<template>
  <q-page class="row items-center justify-evenly">
    <q-btn label="hello" @click="hello('btn')" />
    <OpenDialogFormButton />
  </q-page>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { hello } from '@shisamo/shared'
import { useDialogFormButton, initDialogForm } from 'composables/dialog-form'

const { OpenDialogFormButton } = useDialogFormButton()

onMounted(async () => {
  await initDialogForm('Consignors', 'create')
})

</script>
