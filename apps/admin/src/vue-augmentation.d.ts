import type { Logger } from '@shisamo/shared'

declare module 'vue' {
  interface ComponentCustomProperties {
    $logger: Logger
  }
}

declare module 'vue-router' {
  interface RouteMeta {
    public?: boolean
    errorStatus?: number
    errorMessage?: string
  }
}
