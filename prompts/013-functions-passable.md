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
