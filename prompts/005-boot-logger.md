# Logger を boot で import しつつ、エラーハンドラも追加

## prompt

```markdown
packages/shared/src/telemetry から boot で Logger をインポートして。
- どのファイルからも import 出来るように export して。
    - getLogger とデフォルトの prefix である `admin` Logger を export して。
    - デフォの Logger は $logger プロパティにも生やしておいて。
- Telemetry の初期化も忘れないで。
    - 必要な環境変数を .env に追加しておいて。
```

だいたいイイ感じに出来ているっぽい。
続いてログの出力をお願いする。

```markdown
apps/admin/src/router/auth-guard.ts で例外をキャッチしてる部分で、Logger を使ってエラーログを出力しておいて。
```

これで動作確認したところ、いたるところでエラーが出始めた。  
原因は vue のパスが解決できない事だったが、env.d.ts でアンビエントに拡張すると死ぬとか、そんなやつ。  
↑ これに言及したら、AIが勝手に解決してくれた。  
その前は色々ああでもないしこうでもないしと、混乱し続けていたので、「こいつ混乱してるな？」と思ったら停止してやるのが良さそう。  
そうしないとどんどんコードを汚染するよ。  
その他、import でいちいち type を付けろだとか、色々エラーが出てきたがなんとか解消。

