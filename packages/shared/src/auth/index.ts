export { broadcastResponseToMainFrame } from '@azure/msal-browser/redirect-bridge'

import type { AccountInfo, Configuration, PopupRequest, SilentRequest } from '@azure/msal-browser'
import { PublicClientApplication } from '@azure/msal-browser'

export type { AccountInfo, PopupRequest, SilentRequest }

import type { AsyncMiddleware } from '../pipeline'
import { Pipeline } from '../pipeline'

/**
 * MSAuth の初期化コンフィグ
 *
 * PublicClientApplication の設定をそのまま渡せます。
 */
export type MSAuthConfig = Configuration

/**
 * PublicClientApplication を初期化するミドルウェア
 * initialize() は冪等なので複数回呼び出しても問題ありません。
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const initializeMiddleware: AsyncMiddleware<PublicClientApplication, any> = async (
  client,
  next,
) => {
  await client.initialize()
  return next(client) as Promise<AccountInfo>
}

/**
 * ssoSilent でサイレントログインを試みるミドルウェア
 * 成功時は AccountInfo を返して終了します。
 * 失敗した場合は理由を問わず next(loginPopup)へ委譲します。
 */
const ssoSilentMiddleware: AsyncMiddleware<
  PublicClientApplication,
  AccountInfo,
  AccountInfo,
  PopupRequest
> = async (client, next, request) => {
  try {
    const result = await client.ssoSilent(request)
    return result.account
  } catch {
    return next(client)
  }
}

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
  private readonly client: PublicClientApplication

  constructor(config: MSAuthConfig) {
    this.client = new PublicClientApplication(config)
  }

  /**
   * ログインを実行する
   * ssoSilent → loginPopup の順でログインを試みます。
   */
  async login(request: PopupRequest): Promise<AccountInfo> {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return Pipeline.send(this.client)
      .pipe(initializeMiddleware)
      .pipe(ssoSilentMiddleware, request)
      .then(async (client) => {
        const result = await client.loginPopup(request)
        return result.account
      })
  }

  /**
   * アクセストークンを取得する
   * ログイン済みを前提に acquireTokenSilent を実行します。
   */
  async acquireToken(request: SilentRequest): Promise<string> {
    await this.client.initialize()
    const result = await this.client.acquireTokenSilent(request)
    return result.accessToken
  }

  /**
   * ログアウトを実行する
   */
  async logout(): Promise<void> {
    await this.client.initialize()
    await this.client.logoutPopup()
  }
}
