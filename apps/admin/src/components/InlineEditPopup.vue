<template>
  <q-popup-edit
    :model-value="modelValue"
    :disable="disable"
    @save="onSave"
    v-slot="scope"
  >
    <q-input
      v-model="scope.value"
      dense
      autofocus
      :type="type"
      :input-class="type === 'number' ? 'text-right' : ''"
    />
    <div class="row justify-end q-gutter-x-sm q-mt-xs">
      <q-btn flat size="sm" :label="$t('labels.back')" @click="scope.cancel" />
      <q-btn flat size="sm" color="primary" :label="$t('labels.save')" @click="scope.set" />
    </div>
  </q-popup-edit>
</template>

<script setup lang="ts">
const props = withDefaults(defineProps<{
  modelValue: string | number
  type?: 'text' | 'textarea' | 'number'
  disable?: boolean
}>(), {
  type: 'text',
  disable: false,
})

const emit = defineEmits<{
  save: [value: string | number]
}>()

/**
 * @param val - QPopupEdit から渡される保存値
 */
function onSave(val: string | number): void {
  emit('save', props.type === 'number' ? Number(val) : String(val))
}
</script>
