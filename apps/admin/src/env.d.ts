declare namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV: string
    VUE_ROUTER_MODE: 'hash' | 'history' | 'abstract' | undefined
    VUE_ROUTER_BASE: string | undefined
  }
}

interface ImportMetaEnv {
  readonly VITE_MSAL_CLIENT_ID: string
  readonly VITE_MSAL_AUTHORITY: string
  readonly VITE_MSAL_REDIRECT_URI: string
  readonly VITE_MSAL_API_SCOPE: string
  readonly VITE_APPLICATIONINSIGHTS_CONNECTION_STRING: string
  readonly VITE_API_HOST: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
