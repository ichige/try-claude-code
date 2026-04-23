import type { NavigationGuard } from 'vue-router'
import { useMastersStore } from 'src/stores/masters'

const prefetchGuard: NavigationGuard = async (to) => {
  if (to.meta.public) return

  const masters = useMastersStore()
  if (!masters.loaded) {
    await masters.prefetch()
  }
}

export default prefetchGuard
