# Dialog Form

複数の入力フォームを QDialog を使って実装したい。  
特にマスタデータなどの管理は、共通化可能なはずである。

## prompt

まずは `composable` ディレクトリを追加する。  
これくらい最初から用意して欲しいものではあるが…。

```markdown
`apps/admin` で、`composable` ディレクトリを追加したい。
- `quasar.config.ts` にて、tsConfig の paths に追加する必要がある。
- `components` や `layouts` と同じデザインになるので、`@xxx` とはしないでください。
- `.quasar/tsconfig.json` を参考にしてください。
- `viteConf` には追加は不要なんでしたっけ？
```

### UI管理用 Pinia を作成

まず Dialog の Open/Close を管理する単純な Pinia を用意する。  
ゆくゆくは、フォームの状態管理までさせたいところだが、どこまでやれるか？

```markdown
`stores` に Dialog フォームを管理する store を追加してください。
- まずは Dialog の Open/Close だけを管理するので、state と action を追加してください。
```

つづいて最も単純な Alert Dialog を Layouts に作成し、store で管理させる。

```markdown
`layouts/MainLayout.vue` に単純な Alert を表示する QDialog を追加してください。
- `q-page-container` の外、直下あたりで良いかと。
- QDialog の model にさきほどの dialog-form の isOpen ステートをバインドしてみてください。
```

Open ボタンを作成する。

```markdown
`pages/IndexPage.vue` に追加した Dialog を Open するボタンを作成してください。
- `hello` ボタンの隣で良いです。
```

### Open ボタンを汎用化する

ボタン押下で何かしらの Dialog が開くという動作は常に一緒なので、理論上1つのボタンを再利用できるはずである。  
ラベルなどのデザインはプロパティとして渡すことができるわけだが、これも設定文字だけで解決したいところである。  
そのあたりも考慮して、composable 経由で、ボタンコンポーネントを返すという流れにしておく。

```markdown
`pages/IndexPage.vue` に追加した Open Dialog ボタンを components へ外だししてください。
- `components/actions/xxxXxx.vue` といったアクションボタン的な命名にして。
```

これを composable 経由でボタンコンポーネントを返します。  
つまり composable でボタンをビルドするイメージです。

```markdown
作成した OpenDialogFormButton を composable 経由で `pages/IndexPage.vue` へ渡すようにしてください。
- Factory 型の関数のイメージで、引数を受け取ってボタンの名前を変更するなどを composable で実装するイメージです。
- 現時点では引数なしの、単純な実装で良いです。
- [plugin:vite:import-analysis] Failed to resolve import "composables/useDialogFormButton" from "src/pages/IndexPage.vue". Does the file exist? というエラーが出ています。
- useDialogFormButton.ts はコンポーネントではないので、ファイル名はケバブケースで良いです。ファイル名には use 接頭句も不要かと。
```

これで基本的な構成ができた。  
あとは composable の引数だけで、ボタンから Dialog の中身まで動的に組み立てたいわけである。
