# エラーページの追加

認証エラー(401)とアプリのエラー(500)の簡易的なエラーページを作る。  
SPAなので500エラーが正確とも言えないけど。

Quasar の 404 エラーページをそのまま流用する。

## prompt

```markdown
`apps/admin/src/pages/ErrorNotFound.vue` を修正して、汎用的なエラーページを作ってください。
- fallback ルートはそのまま 404 エラーページとして表示(デフォルト)。
- unauthorized ルートを追加して、401 エラーページとしてとして表示。
- error ルートを追加して 500 エラーページとして表示。
- HTTPステータスやエラーメッセージを汎用エラーページで適切に切り替える。
```

とりあえずはOK。  
細かい修正を指示する。

```markdown
- `ErrorNotFound.vue` だと汎用的な名前ではないので、適切な名前に変更して。
- `pages/ErrorPage.vue` でHTTPステータスやメッセージを定義せず、ルートのメタデータで定義して。 
```

ページはこんなものでOK。  
ログアウト処理後に Unauthorized ページへ遷移するように指示する。

```markdown
`apps/admin/src/components/layouts/AccountSetting.vue` のログアウト処理を実装します。
- logout 実行前に、Dialog プラグインで Confirm を表示させます。
- AuthStore の logout を実行します。
- logout 後に unauthorized ページへ遷移させます。 
```

いくつか型エラーを解消させて完了。  
計45分程度でした。


