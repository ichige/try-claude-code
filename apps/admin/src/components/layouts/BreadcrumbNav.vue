<template>
  <q-breadcrumbs>
    <q-breadcrumbs-el
      v-for="crumb in breadcrumbStore.items"
      :key="crumb.i18nKey"
      :label="$t(crumb.i18nKey)"
      :to="crumb.to"
    />
  </q-breadcrumbs>
</template>

<script setup lang="ts">
import { useBreadcrumbStore } from 'stores/breadcrumb'

const breadcrumbStore = useBreadcrumbStore()
</script>
