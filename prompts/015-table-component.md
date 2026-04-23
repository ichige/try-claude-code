# 汎用テーブルコンポーネントの作成

マスターデータなどは汎用的なテーブルで管理できるはずである。  
どのテーブルを取り扱うか？といった選択も、composable で組み立てる方向性で進める。

## prompt

まずは一覧表示するデータを取得する機能が必要である。


### 一覧データの取得

```markdown
apps/admin/src/stores/masters.ts にコンテナ一覧を取得するアクション関数を追加してほしい。
- functions/src/routes/cosmos-get.ts の cosmos-list が対象のAPI。
- マスタデータは基本的にpkを指定しないので、コンテナ名指定だけでOK。
- 戻り値は functions/src/shared/types/cosmos.ts の CosmosItem を拡張したものになるので、ジェネリクスにしておくと良さそう。
```

戻り値がわかってないようなので、追加指示をだす。

```markdown
list 関数の構成はいいけど、APIの戻り型をよく確認してみてくれ。
- functions/src/actions/middlewares/to-response.ts の toResponses が利用されてるはずだが？
```

微妙に間違えるのは何故なのか。やる気がない日があるのかもしれない。

### テーブル表示ページの作成

続いてマスタデータを表示するテーブルページを作成する。

```markdown
マスターデータを表示するテーブルページを整備していく。
- router/routes.ts に /masters/{container} とったルートを作成する。
- /masters では各マスタデータ一覧ページのリンク集になる予定。
- /masters/{container} で各コンテナの一覧をテーブル表示するイメージ。
- まずは pages 配下に MastersPage を作成。
- components には masters/ContainerTable を作成しておく。
- MastersPage ではとりあえず /masters/Consignors へのリンクを作る。
- ContainerTable では URLパスである Consignors を表示するだけで良い。
- 現時点では画面遷移の確認だけとする。
```

微妙に意図が伝わってないな。

```markdown
MastersContainerPage.vue で実装している処理は、MastersPage.vue に router-view で設定できるのではないか？
```

これでルーティングの構成はOKだろう。  
リンクをサイドメニューに設定しておこう。

```markdown
components/EssentialLink.vue を components/layouts 配下に移動してくれ。
layouts/MainLayout.vue で先ほど作った /masters へのリンクを設定してほしい。
現時点でlinksListに入っているデータはすべて削除して、/masters だけのリンクでOKだ。
アイコンはgoogle material symbols から適切なものを設定しておいて。
```

続いてテーブル表示の前に、モデルの型を決める必要がある。

```markdown
configs/dialog-form/consignors.ts にある schema が Consignors コンテナのアイテムの型になる。
正確には extends CosmosItem となるわけだ。
この型は共有する可能性が高いので、packages/shared/src/types に ConsignorsItem として定義して export してほしい。
```

型が出来たので、テーブルを作成する。

```markdown
次は components/masters/ContainerTable.vue に QTable を使ってテーブルを表示してほしい。
- まずは最もシンプルな方式でテーブル表示を目指す。
- 表示するデータは、CosmosItem 型のサンプルデータ(2レコードほど)でOK。
ごめん、CosmosItem ではなく ConsignorsItem 型だった。 
QTableProps にも反映してください。
```

サンプルテーブルが出来たので、データをプールしておく Store を作成する。

```markdown
apps/admin/src/stores に useConsignors を作成してください。
- stores/masters/consignors.ts というファイル名で良いかと。
- useMastersStore を利用して、ConsignorsItem リスト(Map)を state として保持するのが目的である。
- Map を利用して id 指定で Item を返せる機能が必要になる。
- のちのち ContainerTable で利用するが、現時点では Store だけ生成してほしい。
```

store が形になったので、Storeの初期化時にデータを自動的にフェッチするようにする。

```markdown
pinia-plugin-persistedstate を使っているわけだが、このプラグインにはフック的な機能があったりするか？
afterHydrate は復元対象が存在しなかった場合もコールされるのか？
で、その afterHydrate は async に対応しているか？
となると事実上、そのフックから別のデータをasync でフェッチしてStoreに登録するというパターンは使えないわけだな。
Pinia のプラグインは async が使えるだろ？
であれば、RouterのグローバルGuardが使えるのでは？
beforeResolve と beforeEach のどちらが向いている？
マスタデータは特定のコンポーネントではなく、アプリとして最初のロード時に1回だけまとめて取得する予定だが、その場合はどちらが向いている。
```

いくつか質問したが、データのフェッチはRouter Guard を利用する方向で良さそうだ。  
しかし、LocalStorage からロードされた場合は、フェッチを回避する必要もあり、
一度自動ロードしたらその後は手動やマスタ更新時でのロードになるので、何かしらフラグを使って制御しないと、ページ遷移ごとに無駄にロードしてしまう可能性がある。

```markdown
データのロードは初回リクエスト時の1回としたいので、各マスタストアには loaded のようなフラグを持たせる必要がある。
pinia-plugin-persistedstate の afterHydrate で、ストアに復元出来た場合だけそのフラグを立てるという処理は可能か？
仮に Router の beforeEach に prefetch ガードを用意したとして、各 store を冗長的にロードするしか方法はなさそうか？
つまりマネジメントの Store を用意しろみたいな話やな？
では、そんなイメージで実装しよう。
- useMastersStore に prefetch メソッドを追加。
- loaded フラグは useMastersStore 側でコントロールすれば良いかと。
- Router に prefetch-guard を追加。何らかの拡張があるかもしれないけど、今回は useMastersStore の prefetch しかコールしない。
- 現時点ではマスタデータの localStorage 保存は不要。cosmos db の課金具合で今後考える。
```

なかなかイイ感じの設計になったかな。

```markdown
少々気になるが、useMastersStore が prefetch で useConsignorsStore を利用しつつ、
fetchAll で useMastersStore を使うと相互参照みたいな感じになるが、問題はないか？
では動作確認して、ダメなら専用管理ストアを設けるか。
```

実行時エラーが出たので、もう少し調整する。

```markdown
axios の interceptors で data を返すことで、むしろ型が崩れてるのではないか？
これもTSの弊害の1つだな。
あるいみ PHPDos の方が融通が利くね。JSDoc は中途半端やけど。
```

フェッチは確認できたので、いよいよテーブルに反映する。

```markdown
それでは先ほど作成した ContainerTable.vue に、useConsignorsStore の items を参照するようにして、ダミーデータを削除してください。
ContainerTable 側で computed にするより、useConsignorsStore 側で getters で提供した方が良いのでは？
とりあえず問題なさそうや。useConsignorsStoreのstateやgettersに適当なコメント付けておいて。
ブロック型のコメントにしようぜ。
```

次はテーブルの汎用化。

```markdown
ContainerTable.vue の rows や columns って、composable に外だし出来ると思うんだよね。
composable/containers-table みたいな形で切り出してみて。
作ってもらった container-table.ts だけど、composables/dialog-form.ts と同じように、configs を使った動的 import が可能な気がするんだ。
少なくとも columns は可能かと思うので、確認してみてくれ。
pages/IndexPage.vue の onMounted で実装しているように、ContainerTable.vue で実装できそうでしょ？
useContainerTable でも、initContainerTable で受け取った container で別のストアに分岐はできるよね？
では、そのように修正しておいて。
```

だいたい構成的には良さそうではある。
ここまで作成すると、コンテナの追加くらい簡単にやってくれそうが気がするがどうか。

```markdown
packages/shared/src/types/carriers.ts に CarriersItem を追加しました。
ConsignorsItem と同様にコンテナを追加したいと思います。
- stores/masters に新規 Storeを追加(consignors とほぼ同じ)
- stores/masters.ts の prefetch も対応が必要。
- configs/dialog-form に設定ファイルを追加(consignorsとほぼ同じ)
- configs/container-table に設定ファイルを追加(consignors とほぼ同じ)
- composables/dialog-form.ts で分岐を追加
- composables/masters/container-table.ts で分岐を追加
ここまで対応すれば、登録フォームとテーブル表示ができるかと思う。
```

少々エラーが出たようだが、とりあえず動作はしたようである。
しかし router-view では onMounted が反応しないようである。

```markdown
MastersPage.vue の <router-view /> では ContainerTable.vue の onMounted が発火しないようであるな。
onMounted のかわりに Per-Route Guard が使えないか？watch はなるべく避けたいところだよ。
まぁ、それもありだけど、Per-Route Guard は使えない？
なら、onBeforeRouteUpdate を使ってくれ。
```

Router の機能的に、route パラメータの変更だけでは、Router ガードが発火しないらしい。  
微妙やね。

```markdown
IndexPage.vue にある initDialogForm と OpenDialogFormButton を削除して、ContainerTable.vue へ移してほしい。
QTableのtop slot に OpenDialogFormButton を配置してみて。
configs/dialog-form/carriers.ts の LINEログイン連携 だけど、デフォルトは false でよく、
入力は必要ない場合、buildItems から削除するだけで問題ないよね？
では削除してみて。
```

これで登録ボタンはコンテナごとに切り替わるようになった。  
登録したデータを 各Store に反映したい。

```markdown
store が特定の関数をexportするというインタフェースを設定できる？
とりあえず試しに fetchAll を実装するようにインタフェースを付けてみて。
useCarriersStore と useConsignorsStore だけで良いよ。
それでは、create メソッドも型として定義しつつ。
- useCarriersStore と useConsignorsStore に create メソッドを定義。
- useMastersStore を使い、create して戻り値を items へ追加する。
というサイクルにしたいわけだ。
では dialog-form でinitDialogFormでストアを切替つつ、submit で create を実行するようにしてみてくれ。
```
