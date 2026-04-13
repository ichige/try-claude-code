import { defineStore, acceptHMRUpdate } from 'pinia';
import { ref } from 'vue';
import { type AuthAccount, type PopupRequest, type SilentRequest } from '@shisamo/shared';
import { auth } from 'src/boot/auth';

export const useAuthStore = defineStore('auth', () => {
  const account = ref<AuthAccount | null>(null);

  /**
   * ポップアップ認証フローでサインインし、取得したアカウント情報をストアに保存する。
   * @param request - ログインに使用するポップアップリクエスト設定
   */
  async function login(request: PopupRequest): Promise<void> {
    account.value = await auth.login(request);
  }

  /**
   * サインアウトし、ストアのアカウント情報をクリアする。
   */
  async function logout(): Promise<void> {
    await auth.logout();
    account.value = null;
  }

  /**
   * サイレントフローでアクセストークンを取得する。
   * キャッシュにトークンがない場合は自動的にリフレッシュされる。
   * @param request - トークン取得に使用するサイレントリクエスト設定
   * @returns アクセストークン文字列
   */
  async function acquireToken(request: SilentRequest): Promise<string> {
    return auth.acquireToken(request);
  }

  return { account, login, logout, acquireToken };
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useAuthStore, import.meta.hot));
}
