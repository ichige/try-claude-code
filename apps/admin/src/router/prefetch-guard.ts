import type { NavigationGuard } from 'vue-router'
import { Loading } from 'quasar'
import { useMastersStore } from 'src/stores/masters'
import { useShipmentsStore } from 'src/stores/shipments'

const prefetchGuard: NavigationGuard = async (to) => {
  if (to.meta.public) return

  const masters = useMastersStore()
  const shipments = useShipmentsStore()

  if (!masters.loaded || shipments.needsRefetch) {
    Loading.show({ message: 'データを読み込んでいます...' })
    try {
      await Promise.all([
        masters.loaded ? Promise.resolve() : masters.prefetch(),
        shipments.prefetch(),
      ])
    } finally {
      Loading.hide()
    }
  }
}

export default prefetchGuard
