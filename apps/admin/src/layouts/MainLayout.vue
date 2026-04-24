<template>
  <q-layout view="lHh Lpr lFf">
    <q-header class="bg-transparent" elevated>
      <q-toolbar>
        <q-btn flat dense round icon="menu" aria-label="Menu" @click="uiStore.toggleSideMenu" />
        <BreadcrumbNav />

        <q-space />
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
        <EssentialLink v-for="link in linksList" :key="link.title" v-bind="link" />
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
import EssentialLink, { type EssentialLinkProps } from 'components/layouts/EssentialLink.vue'
import AccountSetting from 'components/layouts/AccountSetting.vue'
import DialogForm from 'components/dialogs/DialogForm.vue'
import { useUIStore } from 'stores/ui'

const uiStore = useUIStore()

const linksList: EssentialLinkProps[] = [
  {
    title: 'ダッシュボード',
    icon: 'sym_o_dashboard',
    link: '/',
  },
  {
    title: 'マスタ管理',
    icon: 'sym_o_table',
    link: '/masters',
    caption: '各種マスタの管理'
  },
]
</script>
