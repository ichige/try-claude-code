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

### getItem

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

### getItemList

次はアイテムリストAPIを実装する。  
すでにパターンが出来上がってるので、一発で実装できる気がしているが？

```markdown
`routes/cosmos-get.ts` の `cosmos-list` を実装する。
- `cosmos-get` 同様に path パラメータで pk をオプションパラメータとして追加する。
- pk はオプションではあるが、`cosmos-get` のようなデフォルトは不要。
- pk 指定がある場合は、readAll のオプションで渡す。
- toResponse の配列版、toResponses を作成し、不要なフィールドの削除ロジックは共有できるように整備する。
- 戻り値がない場合は items に 空の配列を設定する。
```

pk パラメータを追加したことで、エンドポイントが被る。  
URLを変更する。

```markdown
- `cosmos-get` と URL エンドポイントがかぶるので、`{container}/list/{pk?}` へ変更してください。
- `{container}/list/{pk?}` でもかぶるので、`{container}-list/{pk?}` へ変更して下さい。
```

何回かやってみたが、`@azure/functions` のルーティングが弱すぎたので、エンドポイントをもっと明示的なものに変更する。

```markdown
cosmos-bulk-create: [POST] http://localhost:7071/api/bulk-create/{container}
cosmos-bulk-delete: [POST] http://localhost:7071/api/bulk-delete/{container}
cosmos-bulk-update: [PATCH] http://localhost:7071/api/bulk-update/{container}
cosmos-bulk-replace: [POST] http://localhost:7071/api/bulk-replace/{container}
cosmos-create: [POST] http://localhost:7071/api/create-item/{container}
cosmos-delete: [DELETE] http://localhost:7071/api/delete-item/{container}/{id}
cosmos-get: [GET] http://localhost:7071/api/item/{container}/{id}/{pk?}
cosmos-list: [GET] http://localhost:7071/api/item-list/{container}/{pk?}
cosmos-replace: [POST] http://localhost:7071/api/replace-item/{container}/{id}
cosmos-update: [PATCH] http://localhost:7071/api/update-item/{container}/{id}

こんなものかな？
```

いろいろ問題をクリアしたので、テストコードも書いてもらう。

```markdown
例のごとく `actions/middleware` と `schemas` に今回のテストコードを追加しておいて。
```

ルーティング問題で手こずったものの、新しい実装はトータル90分程度で終わった。

IDEがコメント追加しろとか警告を出したのでこれもやってもらう。

```markdown
actions/middlewares/to-response.ts
- 警告:(10, 29) パラメータ _rid は JSDoc で説明されていません
- 警告:(10, 35) パラメータ _ts は JSDoc で説明されていません
- 警告:(10, 40) パラメータ _self は JSDoc で説明されていません
- 警告:(10, 47) パラメータ _attachments は JSDoc で説明されていません
コメントを追加してあげて。
```

### deleteItem

```markdown
`routes/cosmos-delete.ts` の deleteItem を実装したい、
- 例のごとく pk が必要なので、getItem と同じデフォルト付きの path オプションとしてURLに追加してくれ。
- あとの流れは getItem と同じで作ってみてくれ。
- 対象のアイテムがない事が delete の結果でわかるようであれば、deleted に false を設定して、不明なら true でOKす。
```

今回は5分くらいかかった。もう少し早いとは思ったが、自分で書くよりは早い。  
少々修正する。

```markdown
- delete の結果から 404 が判断できるのであれば、一応 NotFoundError を投げておこう。
- その他のエラーは自動で500エラーになるようにしてもらって、事実上 deleted: true を返しておこう。
- たぶんフロント側では 200 以外は削除に失敗したよって判断になるかと。
- 404エラーコードの判定はキャストした方がすっきりするのでは？
```

さらに http test も作ってもらう。

```markdown
`functions/http-tests` に delete のテストリクエストを作っておいて。
```

### Bulk Delete Item

まずは相談から始める。

```markdown
- バルク削除だけど、実際にSDKではどんなメソッドを使うことになる？
- その operations のデータ型はどんなイメージ？SQL？
- そのわりに、container.items.bulk(operations) だと明示的に削除っぽくないやん？
- つまり、operationType で操作がきまる？
- となると、実質他のバルク系と処理的には共通化できるわけやな？
- それは、あくまでバリデート zod スキーマで解決する話かな？
- では、operations の中身の問題(create/deleteが混ざっても関係ない)なわけやろ？
- 普通に考えれば、operationType をデフォルトで設定してもいいわけやな？
- いや、zod で注入できないのかね？
- であれば、zod のバリデートを通過した operations は、そのまま共通 bulk 処理出来るわけだな？
```

設計を詰めたので、実装をお願いする。

```markdown
`routes/cosmos-delete.ts` の bulkDeleteItems の実装をしてほしい。
- operationType は schema レベルで zod のデフォルトとして注入する。
- 実際に受け取るリクエストは `{"id": "xxx", "pk": "xxx"}` のコレクション配列である。
- bulkDeleteItems での bulk 処理は共通化するかもしれないが、現時点では直接実装して欲しい。
- レスポンスはいったんおまかせする。
```

いくつか修正をお願いする。

```markdown
- `const bulkResults = await getDatabase().container(container).items.bulk(operations)` の `bulk` メソッドが非推奨らしい。
- `schemas/bulk-delete-items.ts` で以下のエラーが出てるようだ。
- TS1355: A 'const' assertions can only be applied to references to enum members, or string, number, boolean, array, or object literals.
```

リクエスト body のバリデートが出来てなかったので注文をする。

```markdown
- bulkDeleteItemsBodySchema によるバリデートは、validateParams ミドルウェアで実行できないのかな？
- 作ってくれ。POSTで必要になるんで。
```

テストこーどもお願いしよう。

```markdown
- 例のごとく `schemas` と `actions/middleware` のテストコードをお願いします。
- `http-tests` にも、bulkDeleteItems のHTTPテストを追加して。
- このレスポンス型を `packages/shared/src/types/cosmos.ts` あたりに追加しておいて。
```

### createItem

やや注文が多いけどどうか？

```markdown
`functions/src/routes/cosmos-create.ts` の createItem を実装してください。
- リクエストでは `id` が指定されない場合、zod のデフォルトとしてUUIDを発行する。
- `createdAt` と `updatedAt` はリクエストでは受け取らず、zod でデフォルトとして現在時刻(`Date().toISOString()`)を設定する。
    - 仮にリクエストで渡されたとしても、上書きするイメージ。
- `deletedAt` はデフォルトで null として、同様に上書きと考える。
- `isDeleted` はデフォルト false として、同様に上書きと考える。
- `_etag` はあっても良いけど、こちらで設定することはない。
- それ以外の body は id を含めて Record<string, any> と考えてバリデーションはパスしてOKである。
- create メソッドの前に、HttpRequest.safeBody に登録するデータが構成されているような状態とする。
    - 前述の `createdAt` などを含めておく。
    - `_etag` 以外なので、CosmosItem などを分割するか、何かで型を再定義できるのでは？
- レスポンスは getItem を同じく toResponse を通せばよいだろう。
```

うむ、3分超くらいで完成。  
いつものことながら、修正をお願いする。

```markdown
- `schemas/create-item.ts` で `CosmosItem` は参照なし。非推奨である `z.string().uuid()` が利用されている。
- なぜか作成したファイルの改行コードがCRLFになるけど、LFに統一してね。
- .editorconfig をプロジェクトルートに追加しておいて。IDEはデフォ設定になってる。
- 例のごとく `schemas` にテストコードを追加して。
- pk を忘れてたので、createItemBodySchema で pk がなければデフォで Container 名から作成するようにしておいて。
- createItemBodySchema が何故かPipeline から外れてるけど？
- このAPIのレスポンス型は `packages/shared/src/types/cosmos.ts` に定義されてる？
```

HTTPテストも作ってもらう。

```markdown
{
    "code": "test-0022",
    "name": "お名前です",
    "invoiceNumber": "T30303",
    "paymentRate": 80,
    "note": "備考欄"
}
こんな内容のbodyで、`http-tests` にテストリクエストを追加して。
対象は Consignors でOK
```

だいたい完成した。  
この程度だと60分かからないね。  
夕飯食べたあとで脳みそもリフレッシュしてたからかも？

と思ったら一つ見逃した。

```markdown
あ、よく見たら createItemBodySchema が pipeline に入ってないよ？
validateBody ミドルウェアを使うべきでしょ？
```

また変な修正をしたよ？

```markdown
.pipe(validateBody, (req) => {
  const { container } = (req as EnrichedRequest<z.infer<typeof createItemParamsSchema>>).safeData
  return createItemBodySchema(container)
})

---
これって、ここで container 渡さなくても validateBody で渡せるのでは？
```

こうやって追加注文して、ようやくいい形になった。  
しかし、お手本コードがあっても、まだまだ忘れるというか？微妙なところで手を抜くというか？  
気が抜けないところはある。でも修正は速いので良しよする。

### bulkCreateItems

```markdown
`functions/src/routes/cosmos-create.ts` の bulkCreateItems を実装してください。
- 総合的なデザインは `functions/src/actions/bulk-delete-items.ts` と一緒です。
- body の schema は `functions/src/schemas/create-item.ts` の配列版です。
    - 初期値も同じになるので、可能であれば共通化してください。
    - operationType の挿入も必要です。
- ミドルウェアでschemaを使ってバリデーションを実施してください。
    - `actions/bulk-delete-items.ts` とデザインは同じになるはず。
- 戻り値も `actions/bulk-delete-items.ts` と近い構造で良いです。
```

約3分超でそこそこのレベルで作成できた。  
いくつか修正させる。

```markdown
  return {
    status: 201,
    jsonBody: {
      results: bulkResults.map((r, i) => ({
        id: (operations[i].resourceBody as { id: string }).id,
        created: r.response?.statusCode === 201,
        statusCode: r.response?.statusCode ?? r.error?.code,
      })),
    },
  }
---
このレスポンス生成をミドルウェアとして切り出したい。
`actions/create-item.ts` と同じパターンで `toResponse` の代わりに `toBulkResponse` を作ってくれ。  
まずは単純に移植するだけで良い。
```

続いて共通化させる。

```markdown
- `toBulkCreateResponse` で bulkResults の型は BulkOperationResult になるはずでは？
- BulkOperationResult の operationInput プロパティは `OperationInput` 型になり、今回で言えば `CreateOperationInput` 型になるはずです。
この `CreateOperationInput` 型の判断をして id を取得するようにしてください。
- `toBulkCreateResponse` は `toBulkResponse` に名前を変更して、別のファイルに切り出してください。
- `actions/bulk-delete-items.ts` の `bulkDeleteItems` にも、この `toBulkResponse` を適用します。
`created` や `deleted` は `success` というフィールドで共通化します。 
BulkOperationResult の型で判断することで、id を参照できるはずです。
```

やや過剰なコードがあったので、面倒だから自分で削除・修正した。

```markdown
例のごとく追加した `schemas` と `actions/middleware` にテストコードを書いてください。 
変更があった場合は、テストコードの見直しもお願いします。
`http-tests` に bulkCreate のリクエストを作成してください。
```

やく60分ほどで完了。

### replaceItem

```markdown
`functions/src/routes/cosmos-update.ts` の `replaceItem` を実装してください。
- 全体の流れとしては、`actions/create-item.ts` と同じデザインになる。
- schema は `id` と `pk`、`_etag` は必須として取り扱うこと。
    - `updatedAt` は現在時刻に上書き更新すること。
    - それ以外のフィールドは無視してOK。
- replaceItem では、`_etag` を指定して、不正な更新を制御すること。
- レスポンスは `actions/create-item.ts` と同様で、`toResponse` を利用してください。
```

２分くらいで、なかなかの精度で出来た。

```markdown
- 例のごとく、追加した `schemas` のテストコードを作成して。
- `http-tests` に replaceItem へのリクエスト作成して。
body は create-item を参考にしてください。
```

エラーハンドリングがいまいちなので、追加指示を出す。

```markdown
- 404 エラーに対しては NotFoundErrorがある。deleteItem を参考にして。
- 412 エラーは etag の不一致 Error を新規で定義して対応してほしい。
- その他エラーはとりあえずは放置してOK。出たら対応するイメージで。
- `replaceItem` の `if (!resource) throw new Error('Failed to replace item')` って必要か？
```

計40分くらいで実装完了。

### bulkReplaceItems

```markdown
`functions/src/routes/cosmos-update.ts` の bulkReplaceItems を実装してください。
- 全体的な設計イメージは `actions/bulk-create-items.ts` を参考にしてください。
- schema は `schemas/replace-item.ts` の配列版になります。
    - `schemas/bulk-create-items.ts` と同様に、共通化できそうであれば実施してください。
- レスポンスも同様に `toBulkResponse` ミドルウェアを利用してください。
    - `toBulkResponse` 側では型による対応が必要なはずです。
```

だいぶ精度があがった感がある。  
サンプルコードが増えたせいかな？

```markdown
- 例のごとく追加した `schemas` にテストコードを作ってください。
    - 変更が入った `actions/middleware` のテストコードも必要であれば修正してください。
- `http-tests` に bulkReplaceItems のリクエストを追加してください。
```

今回はわりとあっさり完成した。  
所要時間は30分程度ではあるが、人間側にはリフレッシュが必要である。  

### updateItem

```markdown
`functions/src/routes/cosmos-update.ts` の updateItem を実装して下さい。
- 基本的に `replaceItem` と同じ構成で、`patch` メソッドを利用するくらいしか違いがないかと。
- body の schema で `isDeleted` が boolean 型であることを検証してください。オプションフィールドです。
- `isDeleted` が true の場合は `deletedAt` を現在時刻で上書きしてください。
    - 同様に `isDeleted` が false であれば `deletedAt` は null で上書きしてください。
    - zod での対応が難しい場合、`actions/middleware` に新規でミドルウェアを作成してください。
- レスポンスは replaceItem と同様で、`toResponse` を使ってください。
```

いくつか怪しいところがある。

```markdown
- `patch` メソッドの body には `id` は不要なのでしょうか？
- そもそも `id` の変更は `replace` でも不可能なのでは？
- では間違いなく `patch` では `id` 不要なんですね？微妙な気がしないでもないですが。
```

id は不要らしい。  
そもそも replace で id を要求するのが微妙なんだけど。

```markdown
- 例のごとく追加した schema のテストコードを作成してください。
- `http-tests` に updateItem のリクエストを作成してください。
```

こちらも所要時間は30分程度。  
`schemas` が溢れてきたので、あとで対応したいところ。

### bulkUpdateItems

```markdown
`functions/src/routes/cosmos-update.ts` の bulkUpdateItems を実装してください。
- デザインは `actions/bulk-replace-items.ts` とほぼ一緒なので参考にしてください。
- 可能であれば、`schemas/bulk-replace-items.ts` と同じように、スキーマの設定を共通化してください。
    - schema で適切な `operationType` を設定してください。
    - `isDeleted` や `deletedAt` も対応が必要です。
- レスポンスは toBulkResponse を利用して、`operationInput.operationType` の分岐を適切に追加して対応してください。
```

なんと命令してないのに、テストコードからHTTPリクエストまで作ってくれた。  
なんておりこうさんなんだ！とか思いつつも、修正があるとトークンを無駄に消費することになるので、貧乏人目線からは「まだやってくれるな!」みたいな気持ちにはなる。

しかし見たところ、大きな問題はなさそう。  
やはりサンプルコードがあると精度が上がるという事かな。

実行しみたところエラーがあったので修正させる。

エラーもあったので45分ほどで完成。

### 微調整など


