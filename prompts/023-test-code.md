# テストコードを追加してみる

ぼちぼちビジネスロジックが追加されてきたので、テストコードを追加してみる。

## prompt

```markdown
models 配下の charge.ts と tariff.ts はテストコードが書きやすいと思うのだが？
Vue(Quasar)だと、そもそもテストコードにできる部分が少ないとは思うが、テストコードはどこに配置すべきだと思う？
---
では試しに models 配下のテストコードを作ってみてほしい。
---
models は今後もいくつか追加される予定ではあるが、共通化するかどうかは未定であはる。
いくつか共通化の可能性もあるけど。
現時点では admin 側に構築して良いだろう。
shared は functions でも利用されているわけだし。
```

```markdown
pnpm run lint:shared でエラーがでるね。
functions での npm run test でもエラーが出るね。
uuid を string に変更したせいだと思われる。
uuid → string になったので、実装は正しい。
```

```markdown
charge.test.ts だが、
TS2739: Type '{ id: string; name: string; notes: string; enabled: false; isActive: true; items: ChargeItem[]; createdAt: string; updatedAt: string; _etag: string; }' is missing the following properties from type 'ChargeItems': pk, deletedAt, isDeleted
というエラーが出てるようだ。makeItems のところだな。
---
admin/package.json に型チェックの scripts がないのか？
---
shared/package.json にも型チェックがないかな？
---
functions/package.json には型チェックがあるけど、呼び出し型が違うね。
---
root の package.json に、admin と shared の typecheck を追加してみて。
```
