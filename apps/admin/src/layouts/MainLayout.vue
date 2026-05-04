<template>
  <q-layout view="lHh Lpr lFf">
    <q-header class="bg-transparent" bordered>
      <q-toolbar>
        <q-btn flat dense round icon="menu" aria-label="Menu" @click="uiStore.toggleSideMenu" />
        <BreadcrumbNav />

        <q-space />
        <MonthSelector />
        <AccountSetting />
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="uiStore.sideMenuOpen"
      :mini="uiStore.sideMenuMini"
      show-if-above
      bordered
    >
      <q-list>
        <ProductLogo />
        <q-separator />
        <EssentialLink />
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>

    <DialogForm />
  </q-layout>
</template>

<script setup lang="ts">
import ProductLogo from 'components/layouts/ProductLogo.vue'
import BreadcrumbNav from 'components/layouts/BreadcrumbNav.vue'
import EssentialLink from 'components/layouts/EssentialLink.vue'
import MonthSelector from 'components/layouts/MonthSelector.vue'
import AccountSetting from 'components/layouts/AccountSetting.vue'
import DialogForm from 'components/dialogs/DialogForm.vue'
import { useUIStore } from 'stores/ui'

const uiStore = useUIStore()
</script>
