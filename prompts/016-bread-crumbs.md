# パンくずリストの生成

Router の持つ情報を使って、自動的にパンくずを表示したい。

## prompt

```markdown
apps/admin/src/router にパンくずを自動的に作るための guard を追加したい。
beforeEach と afterEach があるが、after が適しているかな？
---
まずは Guard だけ作って、ルーティングの情報だけ console に出してもらえるか？
---
動的なURLパスパラメータも取得できるのか？
---
となると、Route のメタデータだけでは足らないわけか。
---
コンテナのメタ情報はないけど、i18nでラベルを指定するみたいな事は可能な気がするね。
---
まずは必要な to.matched と to.params を 保存する Store を作って、いったん保存だけ実装してみてくれ。
---
URLが / だと matched が2つになるけど、これは正常なのか？
---
なるほどね。仮に `/masters/Carriers` の場合 `navi.masters.carriers` の i18n が解決できれば、ラベル表示は簡単な気がするな。
---
でもその場合 `/masters` を `navi.masters` にすると、オブジェクトになるけどな。
---
本当は Router の meta で解決できると分かりやすいけど、params がない場合は `navi.masters._root` とかが良いかな。
---
ではその設計で進めてみてくれ。
layouts/MainLayout.vue で微妙に q-breadcrumbs の実装が入ってるけど、上書きして問題ない。  
アイコンも出したいところだが、まずはここだけ実装しよう。
```

と相談しながら進めるパターンも悪くない。  
しかし出てきたソースの品質は微妙なので修正していく。

```
動きは良さそうなので、MainLayout.vue から q-breadcrumbs の機能だけ、
components/layouts にコンポーネントとして切り出してみてくれ。
---
BreadcrumbNav.vue で breadcrumbs を computed で構成してるようだけど、
このロジックは useBreadcrumbStore 側で実装できるのでは？
あと、i18n もキーだけ作って、template 側で $t を使えると思う。
---
で、少々勘違いさせてしまったようだけど、router/routes.ts で meta は利用しないんだよ。
URLパスの `/` を `.` に置換する。 
`/` → `.` になるので `navi.` になり、params がないから `navi._root` になる。
`/masters` → `.masters` → `navi.masters` → `navi.masters._root`
`/masters/{container}` → `masters.{container}` になり、params もあるわけでこれを置換する。
→ `masters.carriers` になる。
`/` は特別だけど、それ以外は規則的に i18n のキーに変換できるのではないか？
---
動きは問題ないけど、params が存在するということは、URL を変換できるって事が確定してるよね？
`{container: 'Consignors'}` があれば問答無用でキーをつかって変換できるはずかと思うんだ。
---
で to の指定なんだけど、{ name: xxxx} 形式の方がすっきりしないかな？
---
なかなか良くできたね。さすがだ。
---
アイコンもやるけど、サイドメニューとも関連させる必要が出てくるので、設計を考えるよ。
```

よくよくソースを見ると、なんとなく無駄な処理がある。

```
apps/admin/src/stores/breadcrumb.ts をよく確認してみてくれ。特に items メソッド。
---
これはキミが午前中に作ったものだけど、今見るとよろしくない部分を把握できたようだね？
---
君たちは考え過ぎな気がするのだけど、
`{path1: 'hoge', path2: 'fuga}` というパラメータがある以上、URLには `:path1/:path2` のようなパラメータが存在する事が確定なのではないのかな？
---
いや、単に params に値が存在する場合、params ベース(ループ)で置換するだけな気がするんだけど？
---
その `/:(\w+)/g` の条件が怪しい気がするけど、パスパラメータに `:` が利用できないようなバリデートがあるのかね？
---
君たちはやけに正規表現に拘っているようだけど、params のキーをそのまま使って置換するほうが安全なのではないのかね？
```
