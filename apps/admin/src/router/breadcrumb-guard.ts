import type { NavigationHookAfter } from 'vue-router'
import { useBreadcrumbStore } from 'src/stores/breadcrumb'

/**
 * パンくずガード
 *
 * 画面遷移でルーティング情報を Store に保存する。
 */
const breadcrumbGuard: NavigationHookAfter = (to, _from, failure) => {
  if (failure) return

  const breadcrumb = useBreadcrumbStore()
  breadcrumb.matched = to.matched
  breadcrumb.params = to.params
}

export default breadcrumbGuard
