# 左サイドのナビゲーション

ナビ設定の管理(設定ファイル)と、現在のURLで Focus を維持させたい。

```markdown
次は 左サイドのナビゲーションメニューを調整する。
MainLayout.vue にリンク設定があり、components/layouts/EssentialLink.vue を使って描画をしてる。
とりあえずは中身をみておいてくれ。
---
まずは MainLayout.vue にあるナビ設定を configs あたりに移しておき、EssentialLink.vue で直接参照してやってくれ。  
複数のナビを使うとも思えないしな。
---
続いて configs/nav.ts の link だけど、name 指定出来るように Object 型に変更してほしい。
link → to にしてもいいし。
---
同じく nav.ts の title だけど、i18n の nav にあるキーに置き換えてくれ。
パンくずと一緒にしておいて良いだろうよ。
EssentialLink.vue で $t で変換やな。
```

まずベースはこんなものでOK。

### 子階層の作成

```markdown
`navi.masters._root` (マスタ管理だけど)、子階層として 
`navi.masters.consignors` (取引先)と `navi.masters.consignors`(配送業者) を追加したい。
実装できそうか？
```

QExpantionItem を使って勝手に作ってくれた。  
なかなかやるな。



