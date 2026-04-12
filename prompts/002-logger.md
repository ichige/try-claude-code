# Logger の生成

Azure Application Insights を利用した Logger を生成する。 
一気に作ると無駄にトークンを消費しそうなので、インタフェースから作らせつつ、実装へという手順で進めてみる。

## prompt

まずはインタフェースを作成させます。

```markdown
SPAで利用する共通Loggerを作って。
- Azure Application Insights を利用する前提です。
- まずはインタフェースから定義し、中身の実装は不要です。
    - 一般的なログ出力メソッドを定義して。
- コードは `src/telemetry/logger.ts` へ保存して。
```

前提が良くなかったのか？ Application Insights のメソッドまで呼べるような構成になっている。  
あくまで Logger インタフェースなので、そこを不要であることを伝えつつ、クラスで実装させてみる。

```markdown
- Logger はあくまで Logging に必要なメソッドに絞り込んでください。  
- Application Insights のメソッドを直接呼べる設計はNGです。 
- Interface から Class に変更し、メソッドの中身はまだ実装しなくて良いです。
```

単純なインタフェースとなったが、この時点では律儀に abstract class として定義された。  
さらに具体的な実装へ進めてみる。

```markdown
- Logger クラスの constructor で ApplicationInsights を注入する設計にしてください。
    - Logger クラスは1つしか作りませんので、abstract は不要です。
- 各メソッドで ApplicationInsights にログを送信するように実装してみてください。
```

なぜか trace というメソッドを勝手に生やした。debug と同じ中身なんだけどね。  
もう少し機能を追加してみる。

```markdown
- trace メソッドと debug メソッドが同じ機能なので、trace メソッドは不要です。
- Logger クラス生成時に `getLogger('prefix')` といった呼び出しを想定しています。
    - prefix はメッセージに `[prefix] message` というフォーマットで出力したいです。
- 上記を踏まえて、error系以外のメソッドは共通privateメソッドに変更できるのではないでしょうか？ 
```

だんだんイイ感じに仕上がってきたので、微調整します。

```markdown
- constructor で受け取る prefix は今後の拡張性も考慮して options (Record)引数として定義して欲しいです。
- trackEvent を使った event メソッドも追加してください。
    - こちらは prefix は不要ですが、name は特定の文字列だけ許可するような型を定義してください(とりあえずサンプルで良いです)。
```

event メソッドの name に型を付けてくれと言ったけど、定数として参照できないので修正させる。

```markdown
- type EventName は実際にメソッドを呼び出す際に定数としてアクセスできるような形が好ましいです。
```

しかしイベント名はアプリ側で定義すべきなので、ジェネリクスに変更することにしよう。

```markdown
- type EventName のイメージはそれでOKだが、アプリ側で型を定義すべきなので、可能ならジェネリクス型に変更してほしい。
```

これでログクラスはだいたい完成かと。  
続いてLoggerを生成するFactoryを作成する。

```markdown
`src/telemetry/index.ts` に Logger の Factory となるクラスを作って。
- クラス名は Telemetry でOK。
    - constructor で config を受け取り、ApplicationInsights へ引き継ぐ。
    - connectionString はデフォルトで環境変数から受け取り、config で上書き出来る。
    - 保持するApplicationInsightsのインスタンスは1つでOK。
- getLogger('prefix') で Logger インスタンスを生成。
    - 現時点では prefix 以外の引数がないので、Factory から options へ渡す。
- load メソッドで application insights の loadAppInsights をコールする。
```

しかし Application insights はブラウザ上でないと機能しないので、果たしてテストコードが書けるものなのか？

```markdown
Telemetry と Logger はブラウザ上でないと動作しませんが、テストコードが書けるでしょうか？
```

モック差し替えでなんとかなるとの回答。頼もしい限りである。

```markdown
ではテストコードを書いてください。
```

テストコードを間違えても自分で修正するとか、実に素晴らしい。  
開発リーダーとして何度もソースレビューや修正指示をしてきたが、このレスポンススピードはとんでもないなと思う。  

```markdown
最後に src/index.ts から export してください。
```

今回はインタフェースから徐々に実装を組み立てる形で進めたみたが、最終的なコードの形が見えているのであれば、この進め方の方が手直しが少なくて済みそうな気がしている。  
出力したコードの確認やコメント追加など合わせて3時間弱くらいで実装出来た。
