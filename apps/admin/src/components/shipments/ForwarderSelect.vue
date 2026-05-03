<template>
  <q-btn flat dense icon="sym_o_list" size="sm">
    <q-menu auto-close>
      <q-list dense style="min-width: 180px">
        <q-item
          v-for="f in forwardersStore.list"
          :key="f.id"
          clickable
          @click="emit('select', f.city)"
        >
          <q-item-section>{{ f.prefecture }} {{ f.city }}</q-item-section>
        </q-item>
      </q-list>
    </q-menu>
  </q-btn>
</template>

<script setup lang="ts">
import { useForwardersStore } from 'stores/masters/forwarders'

const emit = defineEmits<{ select: [city: string] }>()

const forwardersStore = useForwardersStore()
</script>
