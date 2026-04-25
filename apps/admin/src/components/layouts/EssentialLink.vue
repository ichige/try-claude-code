<template>
  <template v-for="link in navLinks" :key="link.titleKey">
    <q-expansion-item
      v-if="link.children"
      :icon="link.icon"
      :label="$t(link.titleKey)"
      :caption="link.captionKey ? $t(link.captionKey) : undefined"
    >
      <q-item
        v-for="child in link.children"
        :key="child.titleKey"
        clickable
        :to="child.to"
        exact
        :inset-level="1"
      >
        <q-item-section avatar>
          <q-icon :name="child.icon" />
        </q-item-section>
        <q-item-section>
          <q-item-label>{{ $t(child.titleKey) }}</q-item-label>
        </q-item-section>
      </q-item>
    </q-expansion-item>

    <q-item
      v-else
      clickable
      :to="link.to"
      exact
    >
      <q-item-section avatar>
        <q-icon :name="link.icon" />
      </q-item-section>
      <q-item-section>
        <q-item-label>{{ $t(link.titleKey) }}</q-item-label>
        <q-item-label v-if="link.captionKey" caption>{{ $t(link.captionKey) }}</q-item-label>
      </q-item-section>
    </q-item>
  </template>
</template>

<script setup lang="ts">
import navLinks from 'src/configs/nav'
</script>
