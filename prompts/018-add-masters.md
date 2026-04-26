# マスタデータの追加

テーブルもだいたい完成してきたので、他のマスタデータ(Container)の設定などを追加する。

## prompt

まずは簡単なところから、Forwarders(積地・卸地)を追加してみる。

```markdown
packages/shared/src/types/forwarders.ts に ForwardersItem を追加した。
ConsignorsItem や CarriersItem のように、マスタデータとしてCRUD機能とテーブル表示まで実装してほしい。
- stores/masters へ、対応する store を追加する。
- useMastersStore での prefetch の対象として追加する。
```

少しずつ進める予定が、勝手にほとんど実装してくれた。  
なかなかすごい。

いくつか i18n に対応してない点があるので、修正しておく。

```markdown
configs/dialog-form/forwarders.ts を見ると、いくつか i18n に対応していないものがあるよね？
調べてみて。
---
まず、どう考えても lang 切替で動的に言語を変更するのは無理があるよね？
---
i18nは使って問題ないけど、lang 変更そのものをURLドメインやサブディレクトリなんかで、切り替えるしかないのでは？
---
render 関数とかバリデーションエラーメッセージとか、やってられない感があるよね？必ずどこかで対応できなくなりそう。
---
いやどのみちUIだけ言語変更したところで、中身は日本語だけやけどな。
---
いや、i18nは表記揺れ問題にも対応する手段ではあるので、そのまま使っていい。
そこでは useI18n でざっくり対応してみてくれ。
useI18nってboot経由でなくても使えるのでは？
使えない場合もあるのか？
なら boot でいいよ。
---
dialog-form.ts で useI18n を使う理由もなくなったよね？
そうではなくて、そのタイミングで使う理由がなくなったのでは？
どうも理解してないようだけど、そのタイミングで変換しないで、読込もとで変換すれば良いのでは？と言ってるわけですよ。
container-table.ts でも同じことやってると思うんだ。
```

バリデーションメッセージも対応しておこう。

```markdown
zod のバリデートエラーメッセージだけど、safeParse の戻り値を使って、メッセージを自前で組み立てる方法はあるのかね？
いや、そういう組み立てではなく、文字列フォーマットの話だよ。
数値みたいのはまだいいけど、「○○は必須です」といった場合やな。
これって、○○が100種類あったらキツイやろ？
---
では、そのパターンを使って、configs/dialog-form/carriers.ts あたりに適用してみてくれ。
utils/zod-rule.ts これを調整すればOKやろ。たぶん。
i18nは、validation.required みたいなイメージでOKや。
---
今の方法だと、too_small ＝ 必須となるやろ？これは良くない。
普通に zod の定義側で i18n で翻訳した定義を渡す
→ zod が勝手に変換してくれる部分は任せる。
→ field など、こちらの都合で変換したいものに限り、zodRule で対応する。
→ つまり、エラーのコードなんか見ないで、常に変換するくらいの気持ちでOK。
---
まだ違うよね。
`companyName: z.string().min(1, 'validation.required')` ここで t で変換する。
そうすることで、数値なりを zod で勝手に書き換えてくれるでしょ？
勝手というと微妙だけど、
z.string().min(3, issue => `${issue.minimum}文字以上入力してください`)
という書き方で変換されるのであれば、zodRule では `{field}` に対して t で変換したフィールド名を文字列置換する。
```

もうちょいやね。

```markdown
zodRule でこの変換パターンを追記していくと、ロジックがファットになるやろ？
この一定の流れを、packages/shared/src/pipeline/index.ts Pipeline で制御できるのでは？
---
まぁ、だいぶ正解に近づいてきたけど、fieldReplace のようなミドルは外から渡す必要ないす。
常設でOKす。
---
いや、だからさ、zodRule でミドルウェアを引数の取らなくて良いって言ってるんだけど？
---
ミドルウェアに目的をコメント追加しておいてね。
ブロック型で書こうぜ。
```

残りの未対応を修正。

```markdown
configs/dialog-form/carriers.ts の label 変数も i18n に対応しておいて。
configs/dialog-form/forwarders.ts も同様にお願いします。
configs/dialog-form/consignors.ts も同様に、バリデートメッセージなどもお願いします。
```
