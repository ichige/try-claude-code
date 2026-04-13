import { defineStore, acceptHMRUpdate } from 'pinia';
import { ref } from 'vue';
import { type AuthAccount, type PopupRequest, type SilentRequest } from '@shisamo/shared';
import { auth } from 'src/boot/auth';

export const useAuthStore = defineStore('auth', () => {
  const account = ref<AuthAccount | null>(null);

  async function login(request: PopupRequest): Promise<void> {
    account.value = await auth.login(request);
  }

  async function logout(): Promise<void> {
    await auth.logout();
    account.value = null;
  }

  async function acquireToken(request: SilentRequest): Promise<string> {
    return auth.acquireToken(request);
  }

  return { account, login, logout, acquireToken };
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useAuthStore, import.meta.hot));
}
