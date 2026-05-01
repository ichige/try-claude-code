# 付帯料金マスタの入力バリデートを追加

こちらは依存関係がないので、比較的すんなりいくはずである。

## prompt

```markdown
ChargesPage.vue にも入力バリデートを追加する。
- シミュレータの入力、simulatorYen、simulatorCount、simulatorMinutes が対象。
- 各値にマイナス値が入らないように強制するだけである。
---
同じように、InlineEditPopup.vue で type === number の場合にマイナス値が入らないようにできるかな？
---
type === string の場合は必須にしたいけど、zod の検証ルールを受け取ってzodRule を使うことが出来るかな？
---
charge.name と row.label に対して、必須＋文字数32文字制限を入れられる？
---
charge.notes は 1024文字、row.notes は256文字のmaxlength だけ入れておいて。
---
confirmPrompt だけど、バリデートは不可能だよね？
---
ではコールバックで name を32文字までに切り取っておいてくれ。
---
変数でいいので、nameSchema の 32 と共通化しておいて。
---
忘れてたけど、TariffsPage.vue のdistanceにも、マイナス値が入らないように強制しておいてほしい。
TariffsForm.vue の simDistance も同様に、マイナス値が入らないように強制しておいてほしい。
```

このマイナスパターンは共通化できそうやな。

```markdown
この単純なマイナス値が入らないようにする強制って、共通化できそうかね？
すでに数か所で使ってるけど。
パターンAだけで良いぜ。 
```

なぜか修正したら、いろいろ壊れた。
何が原因かたしかめる。

```markdown
共通関数にしたところまでは悪くなかったが、どうして v-bind なるものまで利用するはめになった？
```
