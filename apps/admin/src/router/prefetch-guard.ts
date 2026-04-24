import type { NavigationGuard } from 'vue-router'
import { Loading } from 'quasar'
import { useMastersStore } from 'src/stores/masters'

const prefetchGuard: NavigationGuard = async (to) => {
  if (to.meta.public) return

  const masters = useMastersStore()
  if (!masters.loaded) {
    Loading.show({ message: 'データを読み込んでいます...' })
    try {
      await masters.prefetch()
    } finally {
      Loading.hide()
    }
  }
}

export default prefetchGuard
