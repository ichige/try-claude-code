import {
  AccountInfo,
  Configuration,
  PopupRequest,
  PublicClientApplication,
  SilentRequest,
} from '@azure/msal-browser';

export type { PopupRequest, SilentRequest };

import { AsyncMiddleware, Pipeline } from '../pipeline';

/**
 * MSAuth の初期化コンフィグ
 *
 * PublicClientApplication の設定をそのまま渡せます。
 */
export type MSAuthConfig = Configuration;

/**
 * 正規化されたアカウント情報
 */
export interface AuthAccount {
  homeAccountId: string;
  username: string;
  name: string | undefined;
}

function toAuthAccount(account: AccountInfo): AuthAccount {
  return {
    homeAccountId: account.homeAccountId,
    username: account.username,
    name: account.name,
  };
}

/**
 * PublicClientApplication を初期化するミドルウェア
 * initialize() は冪等なので複数回呼び出しても問題ありません。
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const initializeMiddleware: AsyncMiddleware<PublicClientApplication, any> = async (
  client,
  next,
) => {
  await client.initialize();
  return next(client);
};

/**
 * ssoSilent でサイレントログインを試みるミドルウェア
 * 成功時は AuthAccount を返して終了します。
 * 失敗した場合は理由を問わず next(loginPopup)へ委譲します。
 */
const ssoSilentMiddleware: AsyncMiddleware<PublicClientApplication, AuthAccount, PopupRequest> =
  async (client, next, request) => {
    try {
      const result = await client.ssoSilent(request);
      return toAuthAccount(result.account);
    } catch (e) {
      return next(client);
    }
  };

/**
 * MSAL ポップアップ認証クラス
 *
 * ログインは Pipeline によるチェーンで実行されます。
 * 1. PublicClientApplication の初期化
 * 2. ssoSilent によるサイレントログイン(成功時はここで終了)
 * 3. サイレントログイン失敗時は loginPopup にフォールバック
 *
 * @example
 * const auth = new MSAuth({ auth: { clientId: '...', authority: '...' } });
 * const account = await auth.login({ scopes: ['api://xxx/access_as_user'] });
 * const token = await auth.acquireToken({ scopes: ['api://xxx/access_as_user'] });
 * await auth.logout();
 */
export class MSAuth {
  private readonly client: PublicClientApplication;

  constructor(config: MSAuthConfig) {
    this.client = new PublicClientApplication(config);
  }

  /**
   * ログインを実行する
   * ssoSilent → loginPopup の順でログインを試みます。
   */
  async login(request: PopupRequest): Promise<AuthAccount> {
    return Pipeline.send(this.client)
      .pipe(initializeMiddleware)
      .pipe(ssoSilentMiddleware, request)
      .then(async (client) => {
        const result = await client.loginPopup(request);
        return toAuthAccount(result.account);
      });
  }

  /**
   * アクセストークンを取得する
   * ログイン済みを前提に acquireTokenSilent を実行します。
   */
  async acquireToken(request: SilentRequest): Promise<string> {
    await this.client.initialize();
    const result = await this.client.acquireTokenSilent(request);
    return result.accessToken;
  }

  /**
   * ログアウトを実行する
   */
  async logout(): Promise<void> {
    await this.client.initialize();
    await this.client.logoutPopup();
  }
}
