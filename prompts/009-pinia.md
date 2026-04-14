# Pinia のステートを永続化

- [pinia-plugin-persistedstate](https://github.com/prazdevs/pinia-plugin-persistedstate)

これを使うのが定番らしい。  
今まで自前で実装したてけど。

## prompt

```markdown
pinia-plugin-persistedstate を導入して、AuthStore のステートを永続化してください。
```

なぜか boot で実装したのでキャンセル。  

```markdown
プラグインの適用は `apps/admin/src/stores/index.ts` ではないですか？
```

続いて、保存対象をステートの一部に限定する。

```markdown
AuthStore のステート永続化では account まるごとではなく、username だけを対象にする必要があります。
- username(Eメール)はMSAL認証時の login_hint に利用します。
- つまりブラウザでの初回表示において、かならず MSAL認証を1回はさみます。
- pinia-plugin-persistedstate の仕様上、必要であれば login_hint ステートも追加するなど考えてみてください。
```

そこそこやってくれたけど、いまいち理解はしてないようである。  
微調整をする。

```markdown
- login_hint はログイン時に login_hint として渡します。
```

この login_hint を渡すことで、複数のアカウントでログインしている場合の ssoSilent で選択するプロセスが省ける。  
知る人ぞ知るパラメータである。

計30分ほどで完了。  
やるべき事を知っていればこそではあるが。