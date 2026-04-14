import { defineStore, acceptHMRUpdate } from 'pinia';
import { ref, computed } from 'vue';
import { type AuthAccount, type PopupRequest, type SilentRequest } from '@shisamo/shared';
import { auth } from 'src/boot/auth';

export const useAuthStore = defineStore('auth', () => {
  const account = ref<AuthAccount | null>(null);

  /**
   * ログイン状態を返す。
   * @returns アカウント情報が存在する場合は `true`
   */
  const isLoggedIn = computed(() => account.value !== null);

  /**
   * 表示名を返す。
   * @returns 表示名。未設定の場合は空文字
   */
  const name = computed(() => account.value?.name ?? '');

  /**
   * メールアドレスを返す。
   * @returns メールアドレス。未ログインの場合は空文字
   */
  const email = computed(() => account.value?.username ?? '');

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

  return { account, isLoggedIn, name, email, login, logout, acquireToken };
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useAuthStore, import.meta.hot));
}
