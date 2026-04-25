<template>
  <q-btn-dropdown v-if="authStore.isLoggedIn" flat dense no-icon-animation>
    <template #label>
      <q-avatar class="accent-gradient" text-color="white" size="sm">
        {{ (authStore.name || authStore.email).charAt(0).toUpperCase() }}
      </q-avatar>
      <span class="q-ml-sm">{{ authStore.name || authStore.email }}</span>
    </template>
    <q-list dense>
      <q-item>
        <q-item-section avatar>
          <q-icon :name="$icon('email')" size="xs" />
        </q-item-section>
        <q-item-section>
          <q-item-label caption>{{ authStore.email }}</q-item-label>
        </q-item-section>
      </q-item>
      <q-separator />
      <q-item>
        <q-item-section avatar>
          <q-icon :name="$icon('dark-mode')" size="xs" />
        </q-item-section>
        <q-item-section>{{ $t('labels.dark-mode') }}</q-item-section>
        <q-item-section side>
          <q-toggle v-model="isDark" />
        </q-item-section>
      </q-item>
      <q-separator />
      <q-item clickable v-close-popup @click="handleLogout">
        <q-item-section avatar>
          <q-icon :name="$icon('logout')" size="xs" />
        </q-item-section>
        <q-item-section>{{ $t('labels.logout') }}</q-item-section>
      </q-item>
    </q-list>
  </q-btn-dropdown>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useQuasar } from 'quasar'
import { useRouter } from 'vue-router'
import { useAuthStore } from 'stores/auth'

const $q = useQuasar()
const router = useRouter()
const authStore = useAuthStore()

const isDark = computed({
  get: () => $q.dark.isActive,
  set: (val) => $q.dark.set(val),
})

function handleLogout() {
  $q.dialog({
    title: 'ログアウト',
    message: 'ログアウトしますか？',
    cancel: true,
    persistent: true,
  }).onOk(() => {
    // callback に Promise<void> が返せない。
    void (async () => {
      await authStore.logout()
      await router.push({ name: 'unauthorized' })
    })()
  })
}
</script>
