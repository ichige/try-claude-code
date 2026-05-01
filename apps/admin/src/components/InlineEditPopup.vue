<template>
  <q-popup-edit
    :model-value="modelValue"
    :disable="disable"
    @save="onSave"
    v-slot="scope"
  >
    <q-form ref="formRef">
      <q-input
        :model-value="scope.value"
        @update:model-value="v => scope.value = type === 'number' ? Math.max(0, Number(v)) : v"
        dense
        autofocus
        :type="type"
        :min="type === 'number' ? 0 : undefined"
        :input-class="type === 'number' ? 'text-right' : ''"
        :maxlength="maxlength"
        :rules="schema ? [zodRule(schema)] : []"
      />
      <div class="row justify-end q-gutter-x-sm q-mt-xs">
        <q-btn flat size="sm" :label="$t('labels.back')" @click="scope.cancel" />
        <q-btn flat size="sm" color="primary" :label="$t('labels.save')" @click="onClickSave(scope.set)" />
      </div>
    </q-form>
  </q-popup-edit>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { type QForm } from 'quasar'
import { type z } from 'zod'
import { zodRule } from 'src/utils/zod-rule'

const props = withDefaults(defineProps<{
  modelValue: string | number
  type?: 'text' | 'textarea' | 'number'
  disable?: boolean
  maxlength?: number
  schema?: z.ZodType
}>(), {
  type: 'text',
  disable: false,
})

const emit = defineEmits<{
  save: [value: string | number]
}>()

const formRef = ref<InstanceType<typeof QForm> | null>(null)

/**
 * @param set - QPopupEdit の保存コールバック
 */
async function onClickSave(set: () => void): Promise<void> {
  const ok = await formRef.value?.validate()
  if (!ok) return
  set()
}

/**
 * @param val - QPopupEdit から渡される保存値
 */
function onSave(val: string | number): void {
  emit('save', props.type === 'number' ? Number(val) : String(val))
}
</script>
