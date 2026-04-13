# 認証ライブラリ

MSAL(Entra ID) によるポップアップ認証をSPAで実装したい。  

## prompt

認証ライブラリは複雑なものが多く、例えば MSAL と Google の認証を同じインタフェースで設計しようとか思ったところで、それは可能であってもまったく非効率になるはずである。

```markdown
SPA のログイン機能として、共通認証ライブラリ Auth を作る予定です。
ベースは MSAL のポップアップ認証を使う予定ですが、Google One Tap 認証と同じインタフェースで統合出来ると思いますか？
```

回答としては、アカウントのモデルは統合できそうだけど、処理に関しては考え方の違いもあり、あまり効果的ではないとの事。  
そりゃそうだよねと。

では設計フェーズに入る。

```markdown
MSAL でポップアップログインをするライブラリを作成してください。
- `packages/shared/src/auth/index.ts` を起点にします。
- 完全に依存するので、`MSAuth` といったクラス名で良いかと。
- ログイン機能
    - PublicClientApplication の初期化
    - ssoSilent によるサイレントログインの実行
    - loginPopup の事項
    - これらを `packages/shared/src/pipeline` で実装することで、async チェーンとなり処理フローが明確になるかと思います。
- ログアウト機能
    - 単純に logoutPopup を実行すれば良いかと。
```

そこそこのコードが出力されたが改善点を伝える。

```markdown
- PublicClientApplication は MSAuth の constructor でインスタンスを生成して保持してください。
- Pipeline の send で PublicClientApplication か LoginContext を渡してください。
    - LoginContext は不要かも？
- Pipeline における最終到達点は `loginPopupMiddleware` になるので、これを then で渡すようにしてください。
- initializeMiddleware では単純に initialize をコールするだけで良いかと。
    - 何度もコールすることに問題があれば指摘してください。
- ssoSilentMiddleware では成功時に AuthAccount を返して終わりかと思います。
    - 失敗した場合は next 実行です。
```

まだ余計な処理があるので修正させる。

```markdown
- ssoSilentMiddleware で setActiveAccount をコールしていますが、これは不要なのではないですか？
- loginPopup 実行後も同様です。不要であれば削除してください。
```

続いてアクセストークンを取得するメソッドを追加

```markdown
login と同じように、アクセストークンを取得するメソッドを追加してください。
- こちらも同様に initializeMiddleware を実行することを忘れないでください。
```

よく見るとログイン時にスコープが渡されてないので、これも追加。

```markdown
login メソッドでは PopupRequest を引数に受け取っていません。
スコープの指定が必要なので追加してください。
同様にacquireTokenもSilentRequestを引数にしたほうが無難かもしれません。
```

なぜか余計な実装を混ぜてきた。なかなか手ごわいな。

```markdown
SPAでは Vue のRouterガードで毎回 acquireTokenSilent がコールされる想定です。  
アクセストークンの取得はログイン状態が前提となるので、トークンの取得の処理だけで良いです。
おそらくリフレッシュトークンの有効期限切れも現実的ではないでしょう。
```

ベースはこんなもので良いかなと。  
しかし何回か実装経験があるので不要な実装などを指摘できたけど、そうではないケースでは各ライブラリの仕様を把握しておかないと、
不要なコードなどの指摘が難しいかと思われる。

```markdown
このコードも基本的にブラウザで実行しない限り動くことがないわけだが、テストケースは必要か？
```

回答は不要であるとのこと。まぁ、そうなるよねといった感じ。

ここまでの所要時間は3時間程度。  
