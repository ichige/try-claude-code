import { defineStore, acceptHMRUpdate } from 'pinia'
import { ref, computed } from 'vue'
import type { RouteLocationMatched, RouteParamsGeneric, RouteLocationRaw } from 'vue-router'
import { resolveIcon } from 'src/composables/use-icon'

export const useBreadcrumbStore = defineStore('breadcrumb', () => {
  /**
   * 現在のルート情報
   */
  const matched = ref<RouteLocationMatched[]>([])
  /**
   * 現在のルートのパスパラメータ
   */
  const params = ref<RouteParamsGeneric>({})


  /**
   * パンくず生成データの作成
   */
  const items = computed(() => {
    const [, ...pages] = matched.value  // skip layout (index 0)

    return pages.map(r => {
      let routeKey = String(r.name!)
      for (const [k, v] of Object.entries(params.value)) {
        if (r.path.includes(`:${k}`)) {
          routeKey += `.${String(v).toLowerCase()}`
        }
      }
      // 静的ルートの場合 _root 修飾子とする
      const i18nKey = `navi.${routeKey}`
      const routeParams = Object.fromEntries(
        Object.entries(params.value).filter(([k]) => r.path.includes(`:${k}`))
      )
      const to: RouteLocationRaw = { name: r.name!, params: routeParams }
      const icon = resolveIcon(routeKey)
      return { i18nKey, icon, to }
    })
  })

  return { items, matched, params}
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useBreadcrumbStore, import.meta.hot))
}
