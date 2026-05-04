<script setup lang="ts">
import { ref, computed } from 'vue'

export interface SelectOption {
  label: string
  value: string
}

const props = defineProps<{ options: SelectOption[] }>()
const emit = defineEmits<{ select: [value: string] }>()

const filter = ref('')

const filteredOptions = computed(() => {
  if (!filter.value) return props.options
  const q = filter.value.toLowerCase()
  return props.options.filter((o) => o.label.toLowerCase().includes(q))
})

function onHide(): void {
  filter.value = ''
}
</script>

<template>
  <q-btn flat dense :icon="$icon('list-alt')" size="sm" color="secondary">
    <q-menu @hide="onHide">
      <q-input
        v-model="filter"
        dense
        outlined
        :placeholder="$t('labels.search')"
        class="q-pa-sm"
        @keydown.stop
      >
        <template #prepend>
          <q-icon name="sym_o_search" size="xs" />
        </template>
      </q-input>
      <q-separator />
      <q-list dense separator style="min-width: 180px; max-height: 280px; overflow-y: auto">
        <q-item
          v-for="option in filteredOptions"
          :key="option.value"
          v-close-popup
          clickable
          @click="emit('select', option.value)"
        >
          <q-item-section>{{ option.label }}</q-item-section>
        </q-item>
        <q-item v-if="filteredOptions.length === 0" disable>
          <q-item-section class="text-grey-5">{{ $t('labels.search') }}…</q-item-section>
        </q-item>
      </q-list>
    </q-menu>
  </q-btn>
</template>
