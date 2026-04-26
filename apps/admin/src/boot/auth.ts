import { defineBoot } from '#q-app/wrappers'
import { MSAuth } from '@shisamo/shared'

export const auth = new MSAuth({
  auth: {
    clientId: import.meta.env.VITE_MSAL_CLIENT_ID,
    authority: import.meta.env.VITE_MSAL_AUTHORITY,
    redirectUri: import.meta.env.VITE_MSAL_REDIRECT_URI,
  },
})

export default defineBoot(() => {
  // MSAuth は各メソッド内で initialize() を呼ぶため、ここでの処理は不要
})
