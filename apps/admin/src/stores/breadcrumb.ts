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
      const hasParams = r.path.includes(':')
      let pathKey = r.path.replace(/^\//, '').replace(/\//g, '.')
      for (const [k, v] of Object.entries(params.value)) {
        pathKey = pathKey.replace(`:${k}`, String(v).toLowerCase())
      }
      // 静的ルートの場合 _root 修飾子とする
      const i18nKey = hasParams
        ? `navi.${pathKey}`
        : `navi.${pathKey ? `${pathKey}.` : ''}_root`
      const to: RouteLocationRaw = { name: r.name!, params: params.value }
      const icon = resolveIcon(pathKey)
      return { i18nKey, icon, to }
    })
  })

  return { items, matched, params}
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useBreadcrumbStore, import.meta.hot))
}
