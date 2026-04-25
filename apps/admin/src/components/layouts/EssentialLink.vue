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
        manual-focus
        :focused="isFocused(child.to)"
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
      manual-focus
      :focused="link.to ? isFocused(link.to) : false"
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
import { useRoute } from 'vue-router'
import type { RouteLocationRaw } from 'vue-router'
import navLinks from 'src/configs/nav'

const route = useRoute()

/**
 * @param to - NavLink の to
 * @returns 現在のルートと一致するか
 */
const isFocused = (to: RouteLocationRaw): boolean => {
  if (typeof to === 'string') return route.path === to
  if ('name' in to && to.name) {
    if (route.name !== to.name) return false
    if (to.params) {
      return Object.entries(to.params).every(([k, v]) => route.params[k] === String(v))
    }
    return true
  }
  return false
}
</script>
