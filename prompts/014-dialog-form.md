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

### Open ボタンの設定を動的に読み込む

設定ファイルを最初から import すると、ファイルが増えれば増えるほど初期表示が遅くなる。  
これを解決するには、必要なタイミングで動的にファイルを読み込むことである。

まずは、設定ファイルを配置するディレクトリを追加する。

```markdown
`composable` ディレクトリと同様に `configs` ディレクトリを追加してほしい。
```

続いて、Open ボタンのデザイン設定を config ファイルとして作成する。

```markdown
作成した `configs` に、先ほどのダイアログフォーム open ボタンのデザインプロパティを適当に設定として作ってみてくれ。
設定ファイルだけ作ればOKです。
```

これをマウント時に動的に読み込ませる。

```markdown
`composables/dialog-form.ts` に非同期の初期化関数を用意して、先ほどの `dialog-form-button.ts` の内容を動的 import して変数に保存してみてくれ。  
- 非同期関数は `IndexPage.vue` の onMounted あたりで実行してくれ。
- とりあえず読み込んだ値を console.log で出しておいて。
```

ここまでは想定通りだな。  
次はボタンコンポーネントへの適用だが、普通にコンポーネントを書くと面倒なので、render 関数へ置き換える。  
※ デザインは複雑ならSFCの方が良いかと。

```markdown
読み込んだ `dialog-form-button.ts` の内容を open ボタンに適用させてほしい。
- `OpenDialogFormButton.vue` を使うと面倒なので、今回は利用しない。
- かわりに、Qbtn コンポーネントを直接 import して、render 関数として返す形にしてみてくれ。
- では利用しなくなった、`OpenDialogFormButton.vue` は削除しておいてください。
```

うむ、うまくいったようである。  
このパターンを利用することで、設定だけ変更するだけでデザインのコントロールが可能になり、引数で読込先を変更することも可能になった。

### Dialog Form の実装

まずは純粋にコンポーネントとして切り出して、ベースのデザインを実装してしまう。

```markdown
`MainLayout.vue` に作成した QDialog を、`components` の配下に切り出してほしい。
続いて、`DialogForm.vue` の中身に会社情報登録フォームっぽい QForm を使ったフォームを生成してくれ。
- ヘッダ部
- 会社名 1 column
- 住所(郵便番号/都道府県/市区町村・番地/建物名・部屋番号) 2 column
- 連絡先(電話番号/メールアドレス/webサイト) 2 column
- その他(備考欄textarea) 1 column
- model はとりあえず reactive を使ってみてください。
- 登録ボタンとキャンセルボタンを追加。
こんなイメージで。あくまでモック的なものでOK。
```

わりとあっさり出来た。  
細かいデザインは自分で調整するしかない。  
※ 指示にするのが面倒すぎてかえってコストが高い。

### データの登録

それっぽいデータが出来たので、functions api を利用して、データの登録を試みる。

```markdown
`DialogForm.vue` から実際にDBに登録してみようと思う。
`functions/src/routes/cosmos-create.ts` の cosmos-create ルートを使う想定だ。  
- 今回は fetch を使ってPOSTしてみる。
- API の host 名は環境変数から参照するようにしてほしい。
- 基本的に pk を渡すことは想定してないので、引数はコンテナ名と送信するデータ(フォームの入力)だけで良い。
- 今回に関しては、`Consignors` コンテナを対象にする。
- APIの実行機能は Pinia Store の actions として実装してほしい。
```

実装自体はうまくいったけど、いろいろ権限が足りてない。  
この際なので、Functions に Entra ID による Easy Auth を設定したので、アクセストークンをリクエストに設定してみる。

```markdown
useConsignorsStore create で useAuthStore からアクセストークンを取得し、Authorization Bearer トークンとして渡すように変更してほしい。
```

エラーが出たけど、また無茶な修正を始めた。

```markdown
`packages/shared/src/auth/index.ts` の実装はもとに戻してくれ。エラーも出てるし。
`shared/src/auth/index.ts` の logion では AuthAccount という型に変更しているが、そのまま AccountInfo を返すように修正してくれ。
- 当然だが `apps/admin/src/stores/auth.ts` も修正が必要だ。
  acquireToken で account を渡すように修正してくれ。
型があってないようだぜ？
  ERROR(vue-tsc)  Argument of type '{ scopes: string[]; account: { homeAccountId: string; environment: string; tenantId: string; username: string; localAccountId: string; loginHint?: string; name?: string; idToken?: string; ... 4 more ...; dataBoundary?: DataBoundary; } | undefined; }' is not assignable to parameter of type 'SilentRequest' with 'exactOptionalPropertyTypes: true'. Consider adding 'undefined' to the types of the target's properties.
```

### Http Client の整備

fetch だと Client の機能として弱く、そのまま利用すると冗長的なコードが増えてしまう。  
axios は例の事件があったので、やや利用に躊躇してしまいそうだが、結局のところ末端の全てのパッケージがそのような状況に陥る可能性もあるので、axios だけ注意しても致し方がない。  
ここは素直に axios を利用しよう。自前で作っても中途半端になりそうだし。

```markdown
Http Client として axios を導入する。
- apps/admin/src/boot にファイルを追加して、axios を初期化してください。
    - baseURL として、APIのエンドポイントを設定します。
    - interceptors.request.use を利用して、Authorization ヘッダを追加します。
    - interceptors.response.use を利用して、Response body だけを返します。
    - 現時点では初期化した Client だけ export して、app.config.globalProperties への追加は不要です。
- axios を追加したら、stores/consignors.ts の create を axios に変更してください。
```

だいぶイイ感じではあるが、もう少し追加注文する。

```markdown
- `boot/axios.ts` で acquireToken 実行時に account を注入しているが、これは `stores/auth.ts` 側で注入するように修正してください。
`stores/consignors.ts` は `useMastersStore` に名前を変更してください。
- create の引数で、コンテナ名を受け取るように修正してください。
- コンテナ名は `functions/src/schemas/container.ts` と同じです。
```

