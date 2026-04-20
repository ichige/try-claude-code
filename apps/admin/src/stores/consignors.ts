import { defineStore, acceptHMRUpdate } from 'pinia'
import { useAuthStore } from 'stores/auth'

interface ConsignorInput {
  companyName: string
  companyCode: string
  invoiceNumber: string
  paymentRate: string
  postalCode: string
  prefecture: string
  cityStreet: string
  building: string
  phone: string
  email: string
  website: string
  notes: string
}

export const useConsignorsStore = defineStore('consignors', () => {
  const authStore = useAuthStore()

  /**
   * Consignors コンテナにアイテムを登録する。
   * @param data - フォームの入力値
   */
  async function create(data: ConsignorInput): Promise<void> {
    const token = await authStore.acquireToken({
      scopes: [import.meta.env.VITE_MSAL_API_SCOPE],
      ...(authStore.account ? { account: authStore.account } : {}),
    })
    const url = `${import.meta.env.VITE_API_HOST}/api/create-item/Consignors`
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    })
    if (!response.ok) {
      throw new Error(`Failed to create consignor: ${response.status} ${response.statusText}`)
    }
  }

  return { create }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useConsignorsStore, import.meta.hot))
}
