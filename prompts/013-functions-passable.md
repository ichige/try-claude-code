# Functions passable

APIエンドポイントのベースが出来たものの、Pipeline の Passable が HttpRequest であることで、やや使いにくさがある。  
というのも Zod で検証した結果(主にデフォルト値)を params や body に上書きしたいところ、readonly 属性で上書き出来ないからである。

そこで HttpRequest をラップした Passable クラスを用意して対応する。

## prompt

```markdown
`functions/src/actions` の Pipeline に渡す passable を HttpRequest ではなく、カスタム Passable クラスに変更したい。
まずは Passable クラスを生成する。
- request プロパティは constructor で HttpRequest を受け取る。
- response プロパティは HttpResponseInit 型で、デフォルトは 200 ステータスで、`{"success": true}` とかにしておく。
- params プロパティは Record<string, string> 型で、Zod 検証済の path パラメータを保存する。
- query プロパティも同様に Record<string, string> 型で、Zod 検証済の Query パラメータを保存する。
- body プロパティも同様だが、Record<string,any> 型として、Zod 検証済に body(json)を保存する。
- 生成したクラスは `functions/src/lib` へ保存すること。
- まずはこの単純な構成で作ってみてほしい。あくまで作るだけで適用は先になる。
```

とりあえず原型が作成できたので、引き続き進める。

```markdown
- `actions/middlewares/validate-body.ts` や `actions/middlewares/validate-params.ts` で Zod 検証済の値を Passable のプロパティに直接更新する事が出来るか？
何かしら型が合わないとかあるか？
- では、Passable に params, query, body のジェネリクスを追加してくれ。
- とはいえ、Zodの型をそのまま使いたいものの、Pipeline で新たなフィールドを追加する可能性もあるやろ？
- 結局のところ Zod の型を維持したとしても、検証ルールがクソであれば、その値もクソになり、ランタイムエラーは発生するやろ？
- ジェネリクスの型を使うかどうかは微妙な状況なんで、Zod の検証後の値や追加の値ををマージするメソッドを作ってもらえるか？
- 同じくフィールド指定で取得可能な getter メソッドも追加してほしい。デフォルト値も指定できるようにな。
- しかしジェネリクスで指定できても、実際の型とは乖離しないか？
- まぁ、ある意味トレードオフ的なところではあるか。
- では、まずはこれで進めてみるか。
- その前にまずは validate-query を用意しておいてくれ。
- validate-query はこの Passable を使う前提でOKだ。
- `return next(passable.mergeQuery(result.data))` で `TS2345: Argument of type 'unknown' is not assignable to parameter of type 'Record<string, string>'.` が出ているな。 
-しかし、肝心な result.data が unknown になるのでは、微妙だよな。
- 試しにやってみてくれ。
```

Passable パターンを適用した validate-query が出来た。  
現時点では型の強制キャストは入っていない。

```markdown
まずは `functions/src/routes/hello-world.ts` に適用してみよう。
- schema は同じファイルに定義してOK
- 同様にactions まで作る必要もなし。いわゆるサンプルらしいサンプルへ仕上げる。
- おいおい、`Hello, ${name}!` を組み立てる処理を then に入れるべきだろ？学んでくれよ。
```

なぜか手を抜く時があるな。  
とりあえず動いたので、次へすすめる。

```markdown
`actions\middlewares\validate-query.ts` のファイル名を `validators.ts` へ変更して、prams 版と body 版を統合する。
- 既存のファイル `validate-body.ts` などはそのまま放置しておく。
- `validate-body.ts` の Factory 版を `validators.ts` へ追加。
- 同じく `validate-params` の Factory 版を `validators.ts` へ追加する。
- validators は普通に関数別に export して。 * でいいでしょ？
- 昔の関数はあとで削除予定なんで、とりあえず新規の関数は末尾に2でも付けておいて。
```

準備は出来たので、新パターンを各ルートへ適用していく。

```markdown
`functions/src/routes/cosmos-get.ts` の `cosmos-get` ルートで、Passable と新規validate関数を適用してみて。
```

何故か全ルート適用したが、問題はなかったようである。

```markdown
同じく `functions/src/routes/cosmos-delete.ts` のルートも、Passable と新規validate関数を適用してみて。
```

今度はいまいちや。  
`toResponse` も型を付けなおす必要があったようである。

```markdown
- `actions/middlewares/validate-body.ts` と `validateBody2` が同じであれば、配列だろうが検証可能なはずだろ？
- 同様にレスポンスは `toResponses` が利用できるはずで、必要なら `toResponses2` を定義してくれ。
- `actions/list-items.ts` と `actions/get-item.ts` にも toResponse2 を適用してくれ。
```

直ったので次へすすむ。

```markdown
`routes/cosmos-create.ts` も同様に Passable パターンを適用してください。
```

今度は完璧やった。

```markdown
`routes/cosmos-update.ts` のルートも同様に Passable パターンを適用してください。
```

今回も完璧やった。
あとはゴミ掃除。

```markdown
次は `actions/middlewares/validate-body.ts` を削除し、validateBody2 を validateBody 名前を変更してください。
- `actions/middlewares/validate-body.test.ts` のテストも新型に合わせてみてください。
同じく `actions/middlewares/validate-params.ts` を削除し、validateBody2 を validateBody 名前を変更してください。
- 同様に `actions/middlewares/validate-params.test.ts` のテストも新型に合わせてみてください。
- validateQuery2 は validateQuery にリネームして、各actionの方も適用してください。
`actions/middlewares/to-bulk-response.ts` の toBulkResponse を削除して、toBulkResponse2 を toBulkResponse へ名前を変更してください。
- `actions/middlewares/to-bulk-response.test.ts` のテストも新型に合わせてみてください。
```
