# Functions に CRUD API を作成

Azure Cosmos DB に対する汎用的な CRUD 操作を実行できるAPIを作成する。  
Database および Container はポータル上で作成すれば良いだろう。

- CREATE
    - 指定した Container に Item を1つ追加する。
    - 指定した Container に Item を複数追加する。
- READ
    - 指定した Container から Item を1つ取得する(ID指定)。
    - 指定した Container から Item を複数取得する(条件指定)。
- UPDATE
    - 指定した Container の Item を完全に置き換える(ID指定)
    - 指定した Container の Item を部分的に更新する(ID指定)
    - 指定した Container の複数 Item を完全に置き換える(条件指定)。
    - 指定した Container の複数 Item を部分的に更新する(条件指定)。
- DELETE
    - 指定した Container から Item を1つ削除する(ID指定)。
    - 指定した Container から Item を1つ論理削除する(ID指定)。
    - 指定した Container から Item を複数削除する(条件指定)。
    - 指定した Container から Item を複数論理削除する(条件指定)。

という基盤を用意しておきたい。  
出来るかな？

## prompt

まずはエンドポイントだけ作成してしまおう。

```markdown
`functions` に Cosmos DB の CRUD 基盤APIを作成したい。
- まずはエンドポイントだけを構成する。
- Container 名は URL パスから受け取る仕様。
- Container の Item は id とパーティションキー、作成日時/更新日時/削除フラグなどを持った基底インタフェースを定義しておいてほしい。
- 現時点では中身のロジックは書かなくて良い。あくまで各エンドポイントと適当なレスポンスだけ定義して。
```

微妙だけど、とりあえず進める。

```markdown
- `src/lib` あたりに `@azure/cosmos` や `@azure/identity` を使って、CosmosClient を生成するライブラリを作って。
- `functions/src/functions/cosmos.ts` の `listItems` 等のロジック系の関数は、`src/actions` あたりに1ファイルずつ外出しして。
- `functions/src/functions/cosmos.ts` の各APIエンドポイントも、1ファイルずつに分割して。
- `functions/src/functions` 配下のファイル名をケバブケースにして。
- `functions/src/functions/cosmos-update.ts` には POST メソッドの全置換APIも用意して。
- 同じように、create と update にバルクメソッド(複数のアイテムを対象)も追加してほしい。
- POSTメソッドの全置換バルク版も追加して。
- 仕方ないので、POST メソッドのバルクDeleteも追加して。
- `src/actions` のファイル名もケバブケースにしてくれ。
- `functions/cosmos-get` に `functions/cosmos-list` を統合しておいて。
- functions にも prettier 入れておいて。
```

ここまでで、約3時間程度かな。  
次は実装フェーズ。

```markdown
`functions/src/actions/get-item.ts` で、コンテナ名とidを元に Cosmos DB から Itemを取得する処理を書いてみて。
```

普通にクエリを書いた。  
そっち方面を選択するとは…。

```markdown
- query は利用せずに、Container → Item → Read → Resource を返すというパターンで実装しなおして。
- database メソッドを各ごとに環境変数を見る処理を書くのは冗長なので、`functions/src/lib/cosmos.ts` に関数を追加して。
- telemetry で発生するエラーだけど、functions でそこを参照するケースはないので除外できる？
- `actions/get-item.ts` に Pipeline を導入して、request を send して then でアイテムを取得するように変更して。
- 404 エラー判定とレスポンスをミドルウェアに置き換えそうだろ？
- それは違うね。destination こそ本来の目的であるDB取得しょりを行うところだよ。よく考えて。
- 404エラー判定のミドルは、それだけに徹したロジックとしてミドルを分離してくれ。すなわち toResponse が null を返せばOKやろ？
- ではミドルウェアは actions/middlewares/xxx として切り出しつつ、index.ts でexportする形にしてくれ。
```

だいぶ完成系に近づいた。もう少し。  
統合エラーハンドラを追加する。

```markdown
- まず postInvocation を使って統括したエラーハンドラを作成してくれ。基本は500エラーで良いだろう。
- src/errors とか に NotFoundError かなんか定義して、それを 404 エラーとして返すように機能追加してみてくれ。
- 404コードは NotFoundError に持たせた方がハンドリングしやすいだろ。
- `functions/src/actions/middlewares/not-found.ts` が不要になって、NotFoundError を投げる形に修正してみてくれ。
```

続いてバリデータを追加する。

```markdown
getItem に渡される HttpRequest の container と id を検証するバリデータを zod を使って実装してほしい。
- container は `Consignees`, `Carriers`, `Forwarders`, `Consignors` の4つだが、今後も増える想定。
- id は UUID 型
- 検証スキーマ(ルール)は `src/schemas` あたりに保存。
- バリデーションミドルウェアは `src/actions/middlewares` あたりに保存すれば良いかと。
- バリデーションエラーは postInvocation でハンドリングして、エラーメッセージ詳細も渡せるとなおよろしい。
```

いくつか問題点があるので修正させる。

```markdown
- `id: z.string().uuid(),` の `uuid` は非推奨になっている。代替機能があればそれを使い、なければ文字列+文字長か正規表現でも良い。
- postInvocation の例外ハンドリングの見通しが悪くなっている。これもPipeline で段階的にレスポンスを構成できるのでは？
- ctx を send して、destination なしの　thenReturn すれば(というか直接更新で充分)良さそうだけど？
- 問題は handleHttpError で、せっかくエラーのクラスがあるので、プロパティではなくクラスでミドルウェアを分けたほうがスッキリ明確になるのでは？
- hooks は index.ts で export して、import をまとめておこう。
```

最後にレスポンス型を修正させる。

```markdown
`actions/middlewares/to-response.ts` の toResponse だけど、不要なメタデータ `_etag` 以外を削除しておきたい。
- getItem の read<CosmosItem> で Resource を交差しておけば、`as CosmosItem & Resource` と書かなくても良いのでは？ 
- CosmosItem には _etag 入れておいて。
- CosmosItem の型を `package/shared` か `package/types` みたいなところにおいて共通化できるか？ 
- `src/functions` を `src/routes` に変更できるか？
```

これで基本的な構造が出来た気がする。

ローカルサーバのテストをしたら、エラーが発生。  
esbuild でバンドルしたことで、インスタンス名が判断できないらしい。  
非バンドルで再ビルドした。

getItem ではパーティションキー(pk) を指定する必要があった。

```markdown
- HttpRequest の params には任意の値を追加できるのか？
- Readonly だと zod でデフォルト値を設定しても、直接の更新が出来ないわけだな？
- HttpRequest に safeData みたいなプロパティの拡張が可能ではあるのか？
- Intersection type に変換することで対応できるとのこと。
- zod では動的にデフォルト値を設定できたりするか？
- `pk-{container.toLowerCase()}` みたいなイメージでデフォルト pk を定義しつつ、URL にもオプションで pk を追加してみてくれ。
- path のオプションって定義できないんだっけ？
- Resource の _attachments は `src` の直下あたりでxx.d.ts ファイルにでも定義しておいてくれ。 
```

こんな感じで pk を URL パスのオプションで受け取る形に変更した。

続いてテストコードも作成してみる。

```markdown
`{container}/{id}/{pk?}` エンドポイントの流れで、テストコードを作ってほしいが、hooks と actions.middleware 以外にテストすべきコードはあるか？
- functions では vite を使ってないけど、テストコードは何のライブラリがおすすめだ？
- それでは shared と同様に vitest を使い、コロケーションパターンで作ってみてください。
- 対象は hooks, schemas, actions/middlewares でお願いします。
```

うむ。yahoo の記事を読んでる間にテストケースが出来た。  
微修正を行う。

```markdown
`hooks/handle-validation-error.test.ts` で非推奨の `z.string().uuid()` が利用されてるようです。
```




