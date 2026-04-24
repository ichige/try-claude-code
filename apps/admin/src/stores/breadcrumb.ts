import { defineStore, acceptHMRUpdate } from 'pinia'
import { ref, computed } from 'vue'
import type { RouteLocationMatched, RouteParamsGeneric, RouteLocationRaw } from 'vue-router'

export const useBreadcrumbStore = defineStore('breadcrumb', () => {
  const matched = ref<RouteLocationMatched[]>([])
  const params = ref<RouteParamsGeneric>({})

  function set(newMatched: RouteLocationMatched[], newParams: RouteParamsGeneric): void {
    matched.value = newMatched
    params.value = newParams
  }

  const items = computed(() => {
    const [, ...pages] = matched.value  // skip layout (index 0)

    return pages.map(r => {
      const paramMatch = r.path.match(/:(\w+)/)
      const paramValue = paramMatch ? params.value[paramMatch[1]!] : undefined
      const pathKey = r.path
        .replace(/^\//, '')
        .replace(/\//g, '.')
        .replace(/:(\w+)/g, (_, k) => String(params.value[k] ?? '').toLowerCase())
      const i18nKey =
        paramValue !== undefined
          ? `navi.${pathKey}`
          : `navi.${pathKey ? `${pathKey}.` : ''}_root`
      const to: RouteLocationRaw = { name: r.name!, params: params.value }
      return { i18nKey, to }
    })
  })

  return { items, set, matched, params}
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useBreadcrumbStore, import.meta.hot))
}
