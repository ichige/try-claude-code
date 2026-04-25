<script setup lang="ts">
import { useUIStore} from 'stores/ui'

const uiStore = useUIStore()
</script>

<template>
  <q-item clickable @click="uiStore.sideMenuMiniOff">
    <q-item-section avatar>
      <q-avatar class="primary-gradient"  text-color="white" rounded>S</q-avatar>
    </q-item-section>
    <q-item-section>
      <q-item-label class="text-weight-bold">{{ $t('app.name') }}</q-item-label>
      <q-item-label caption>{{ $t('app.caption') }}</q-item-label>
    </q-item-section>
    <q-item-section side>
      <q-btn icon="sym_o_arrow_menu_close" flat dense round @click.stop="uiStore.sideMenuMiniOn" />
    </q-item-section>
  </q-item>
</template>

