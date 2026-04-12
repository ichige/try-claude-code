# Pipeline の生成

Laravel の Pipeline に近いものを実装する。  
基本的に async ハンドラを取り扱うようにすれば良いだろう。

## prompt

モデルは Sonnet 4.6 です。

```markdown
https://github.com/laravel/framework/blob/13.x/src/Illuminate/Pipeline/Pipeline.php
LaravelのPipelineを同じようなデザインで、TypescriptでPipelineを作って。

- constructor は引数なしでOK
- send の引数 passable はジェネリクスで型を指定したい。
- through メソッドはなしでOK
- pipe メソッドのチェーンでミドルウェアを設定するインタフェースにする。
- ミドルウェアは async 関数に限定する。
    - ミドルウェアには passable next と options = null を渡せるようにして、pipe 時に option を設定できるインタフェースとする。
    - options にもジェネリクスで型を指定したい。
- ミドルウェアは async 関数になるので、via などのメソッドは不要。
- then で渡す destination もジェネリクスで型が指定できるのが好ましい。
- destination なしの thenReturn メソッドも用意してほしい。
- finally 機能も入れておいてほしい。
- コードは src/pipeline/index.ts に出力して。
- src/index.ts から export する。

```

とりあえずそれっぽいクラスが作られたが、いくつか改善をお願いする。

```diff
src/pipeline/index.ts のPipelineを改善してほしい。
- AsyncMiddleware では 入力 T と レスポンスの型は一致しないので、レスポンスは別のジェネリクスとして設定して欲しい。
```

だいたいイイ感じになったので、テストコードを作ってもらう。

```markdown
src/pipeline/index.ts のPipelineのテストコードをいくつか作ってほしい。
- Test には Vitest の最新版を利用してください。
- コロケーションパターンでお願いします。
- テストは package.json の scripts で実行出来るようにお願いします。
- もちろん今後もテストケースが追加される想定の構成でお願いします。
```

なんと17個も作ってくれた。  
比較的単純なクラスではあるが、これを自分で作ったら半日はかかりそう。  
設計フェーズを合わせて計2時間程度で完了。

最後に Linter も追加してもらった。

```markdown
src 配下に適切なLinterを追加して。
```

## 再点検

実装後に再点検してもらう。  
※ 本当なら別のAI(モデル)が良さそうだけど。

```markdown
packages/shared/src/pipeline/index.ts に何か懸念点や、別の提案はあるか？
```

send メソッドが static であるべきとの事で、修正を頼んだ。

```markdown
send メソッドを static に変更して。
```

メソッド変更に合わせてテストケースの呼び出しまで修正してくれる。  
非常に頼もしい。
他にもいくつか問題点が出たけど、話し合いの結果妥当でもあるという評価になった。
