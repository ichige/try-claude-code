import type { NavigationHookAfter } from 'vue-router'
import { useBreadcrumbStore } from 'src/stores/breadcrumb'

const breadcrumbGuard: NavigationHookAfter = (to, _from, failure) => {
  if (failure) return

  const breadcrumb = useBreadcrumbStore()
  breadcrumb.set(to.matched, to.params)
}

export default breadcrumbGuard
