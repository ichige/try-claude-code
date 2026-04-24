import { defineStore, acceptHMRUpdate } from 'pinia'
import { ref } from 'vue'

export const useUIStore = defineStore(
  'ui',
  () => {
    const sideMenuOpen = ref(true)
    const sideMenuMini = ref(false)

    function toggleSideMenu(): void {
      sideMenuOpen.value = !sideMenuOpen.value
    }

    function sideMenuMiniOn(): void {
      sideMenuMini.value = true
    }

    function sideMenuMiniOff(): void {
      sideMenuMini.value = false
    }

    return { sideMenuOpen, sideMenuMini, toggleSideMenu, sideMenuMiniOn, sideMenuMiniOff }
  })


if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useUIStore, import.meta.hot))
}
