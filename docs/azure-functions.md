# Azure Functions

## functions の作成

CLIでも作成できるが、ポータルから作成しておく方が設定項目など理解しやすい。  
従量課金(フレキシブルではない方)で作成すると、無料枠が使える。
その他設定もAIに確認しながらやるといい。  
大抵のものは後で修正できるはず。

## マネージドIDへの権限付与

この権限の付与は、なぜかポータル画面上から出来ないため、CLI でのコマンド実行を行う。

```bash
# ログインしておく。
az login
# まずはロールの確認をする。
az cosmosdb sql role assignment list \
    --account-name <database-name> \
    --resource-group <resource-group-name> \
    --query "[?principalId=='<managed-id>']"

## cosmosdb のロールを確認する
az cosmosdb sql role definition list \
  --account-name <database-name> \
  --resource-group <resource-group-name>

# role-definition-id が判明するので、それを指定してロールを付与する。
az cosmosdb sql role assignment create \
  --account-name <database-name> \
  --resource-group <resource-group-name> \
  --scope "/" \
  --principal-id <managed-id> \
  --role-definition-id 00000000-0000-0000-0000-000000000002
```

わりと時間がかかるが、作成されたら念のためにロールを確認しておこう。

## Easy Auth

MS365アカウント(Entra ID)を使った、ゲートウェイ認証を簡単に設定できる…という話ではあるが、実はそんなに簡単ではない。

- Entra ID のアプリケーションの設定
    - Entra ID → アプリの登録 という遷移でしかたどり着かない設定。
    - API の公開という部分が重要。
- Functions の認証設定
    - 認証設定でIDプロバイダを設定する必要がある。

### アプリケーションの設定

- Entra ID → アプリの登録と遷移して、登録済のアプリから設定を選択する。  
- サイドメニューにある「APIの公開」設定を開く。
- Scope の追加で、任意の名前でスコープ名を追加する。
    - 例) access_as_user など。
- 認証済のクライアントアプリケーションを追加する。
    - 上記で発行されたスコープが許可されていること。
- サイドメニューにある「マニフェスト」設定を開く。
    - MS Graph の appRoles が空の配列になっていること。
    - MS Graph の api.requestedAccessTokenVersion が 2 になっていること。
    - AAD Graph の accessTokenAcceptedVersion が 2 になっていること。

とくに「マニフェスト」はハマるので注意する。  
自動で出力してくれるわりに、動かない…みたいな罠がある。

### Functions の設定

- サイドメニューの「認証」設定を開く。
- 「プロバイダの追加」を行う。
    - Microsoft(Entra ID)を選択する。
    - クライアントアプリケーションの要件設定などは、アプリの要件次第。
    - 「このアプリケーション自体からの要求のみを許可する」
    - 「任意の ID からの要求を許可する」
    - 「発行者テナント (<tenant-id>) からの要求のみを許可する
    - といった設定をした。

ここでハマりポイントがある。
「発行者URL」にはデフォルトでURLが設定されているのだが、これは上記のパターンでは利用できない。
`https://login.microsoftonline.com/<tenant-id>/v2.0` という設定に書き換える必要がある。  
しかも初期状態では入力できないので、一度保存してから編集しなおす必要がある。

またブラウザからの実行なので、CORS の設定も必要になる。  
利用環境のホスト名を入力しておこう。

