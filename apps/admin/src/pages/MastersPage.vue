<template>
  <q-page class="q-pa-md">
    <router-view>
      <template #default="{ Component }">
        <component :is="Component" v-if="Component" />
        <div v-else class="text-grey text-center q-mt-xl">
          <q-icon name="sym_o_construction" size="48px" />
          <div class="q-mt-sm">工事中</div>
        </div>
      </template>
    </router-view>
  </q-page>
</template>

<script setup lang="ts">
</script>
