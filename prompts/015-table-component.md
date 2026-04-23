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
