import type { RouteLocationRaw } from 'vue-router'
import { resolveIcon } from 'src/composables/use-icon'

export interface NavChildLink {
  titleKey: string
  to: RouteLocationRaw
  icon: string
}

export interface NavLink {
  titleKey: string
  captionKey?: string
  to?: RouteLocationRaw
  icon: string
  children?: NavChildLink[]
}

const navLinks: NavLink[] = [
  {
    titleKey: 'navi.dashboard',
    icon: resolveIcon('dashboard'),
    to: { name: 'dashboard' },
  },
  {
    titleKey: 'navi.masters',
    icon: resolveIcon('masters'),
    captionKey: 'navi.masters-caption',
    children: [
      // 取引先
      {
        titleKey: 'navi.masters-container.consignors',
        icon: resolveIcon('masters-container.consignors'),
        to: { name: 'masters-container', params: { container: 'consignors' } },
      },
      // 配送先
      {
        titleKey: 'navi.masters-container.consignees',
        icon: resolveIcon('masters-container.consignees'),
        to: { name: 'masters-container', params: { container: 'consignees' } },
      },
      // 配送業者
      {
        titleKey: 'navi.masters-container.carriers',
        icon: resolveIcon('masters-container.carriers'),
        to: { name: 'masters-container', params: { container: 'carriers' } },
      },
      // 積・卸地
      {
        titleKey: 'navi.masters-container.forwarders',
        icon: resolveIcon('masters-container.forwarders'),
        to: { name: 'masters-container', params: { container: 'forwarders' } },
      },
      // 運賃
      {
        titleKey: 'navi.masters-tariffs',
        icon: resolveIcon('masters-tariffs'),
        to: { name: 'masters-tariffs' },
      },
      // 付帯料金
      {
        titleKey: 'navi.masters-charges',
        icon: resolveIcon('masters-charges'),
        to: { name: 'masters-charges' },
      },
    ],
  },
]

export default navLinks
