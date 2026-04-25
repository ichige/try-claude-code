# アカウントコンポーネント

MSアカウントでログインできるようになったので、管理画面の右上へアカウント情報を表示するコンポーネントを作成する。

## prompt

まずは細かい指定をせずにコンポーネントを作ってみる。

```markdown
MSアカウントでログインが出来るようになり、`apps/admin/src/stores/auth.ts` のストアに情報が保存されるようになりました。  
このアカウント情報を `apps/admin/src/layouts/MainLayout.vue` の `q-header` 内に表示したいと考えています。
- 画面の配置的にはヘッダ内の右端が好ましい。
- `q-btn-dropdown` コンポーネントを使うのが良さそう。
- slot を使い `q-avatar` でユーザ名の1文字目を表示する。
- dropdown には Eメールとログアウトボタンを配置する。
    - ログアウトボタンのアクションはまだ実装しなくて良いです。
```

まずはそれっぽいものが出来た。
続いてコンポーネントを外部ファイルに切り出してみる。

```markdown
作成したアカウントコンポーネントを別ファイルに切り出してください。
- `src/components/layouts/AccountSetting.vue`
```

細かい微調整を続ける。

```markdown
- AuthStore にログイン状態を判定する getters を追加してください。
- AccountSetting の template内で で直接ストアを参照するように変更してください。
- AuthStore に username と email を返す getters を追加して下さい。
- name と email にしましょう。undefined ではなく空文字を返してください。
- AccountSetting の Avatar の隣(ボタンのラベル)にユーザの名前を表示してください。
- MainLayout から Quasar のバージョンを削除してください。
- AccountSetting の avatar の背景色を白にして下さい。
- AccountSetting のドロップダウンにダークモード変更のスイッチを追加してください。
- AccountSetting の icon を Google の Material Symbols へ変更してください。
```

最後に見た目を変更して終わり。  
計90分程度かな。  
Quasar のコンポーネントの組み合わせなどは、自分で考えるよりは早いので便利である。  
しかし見た目の調整はさすがに自分でやらないと、細かい調整は難しいと思われる。