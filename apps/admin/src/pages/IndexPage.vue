<template>
  <q-page class="row items-center justify-evenly">
    <q-btn label="hello" @click="hello('btn')" />
  </q-page>
</template>

<script setup lang="ts">
import { hello } from '@shisamo/shared'
</script>
