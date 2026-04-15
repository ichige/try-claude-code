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

```markdown
- まず postInvocation を使って統括したエラーハンドラを作成してくれ。基本は500エラーで良いだろう。
- src/errors とか に NotFoundError かなんか定義して、それを 404 エラーとして返すように機能追加してみてくれ。
- 404コードは NotFoundError に持たせた方がハンドリングしやすいだろ。
- `functions/src/actions/middlewares/not-found.ts` が不要になって、NotFoundError を投げる形に修正してみてくれ。
```