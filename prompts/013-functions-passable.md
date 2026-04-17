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
