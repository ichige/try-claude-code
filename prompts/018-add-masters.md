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
