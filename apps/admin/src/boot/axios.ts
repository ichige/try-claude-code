import { defineBoot } from '#q-app/wrappers'
import axios from 'axios'
import { useAuthStore } from 'stores/auth'

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_HOST,
})

api.interceptors.request.use(async (config) => {
  const authStore = useAuthStore()
  const token = await authStore.acquireToken({
    scopes: [import.meta.env.VITE_MSAL_API_SCOPE],
  })
  config.headers.Authorization = `Bearer ${token}`
  return config
})

api.interceptors.response.use((response) => response.data)

export default defineBoot(() => {})
