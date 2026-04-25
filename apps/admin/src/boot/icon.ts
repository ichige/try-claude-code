import { defineBoot } from '#q-app/wrappers'
import { resolveIcon } from 'src/composables/use-icon'

declare module 'vue' {
  interface ComponentCustomProperties {
    $icon: (key: string) => string
  }
}

export default defineBoot(({ app }) => {
  app.config.globalProperties.$icon = resolveIcon
})
