<template>
  <q-dialog v-model="dialogFormStore.isOpen" persistent @hide="onHide">
    <q-card style="min-width: 720px">

      <q-card-section class="bg-primary text-white">
        <div class="row items-center no-wrap">
          <q-avatar icon="sym_o_domain_add" class="q-mr-sm" rounded color="white" text-color="primary" size="md" />
          <div class="text-h6">会社情報登録</div>
        </div>
      </q-card-section>

      <q-card-section>
        <q-form @submit="onSubmit">

          <template v-for="(section, i) in sections" :key="i">
            <div class="row items-center" :class="i === 0 ? 'q-mb-md' : 'q-my-md'">
              <q-icon :name="section.header.icon" size="xs" class="q-mr-xs" color="primary" />
              <div class="text-caption q-mr-xs text-primary">{{ section.header.label }}</div>
              <div class="col bg-grey-5" style="height: 1px;"></div>
            </div>
            <div class="row q-col-gutter-md">
              <div v-for="(field, j) in section.fields" :key="j" :class="field.col">
                <component :is="field.component" />
              </div>
            </div>
          </template>

          <q-separator class="q-mt-md" />
          <q-card-actions align="right" class="q-mt-md">
            <q-btn label="キャンセル" color="grey" size="md" dense unelevated v-close-popup />
            <q-btn type="submit" :label="dialogFormStore.mode === 'create' ? '登録' : '更新'" color="positive" size="md" unelevated dense />
          </q-card-actions>

        </q-form>
      </q-card-section>

    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { useDialogFormStore } from 'stores/dialog-form'
import { useDialogFormConfig } from 'composables/dialog-form'

const dialogFormStore = useDialogFormStore()
const { sections, onSubmit, onHide } = useDialogFormConfig()
</script>
