# Clade Code お試し

- phpstorm + Claude Code でアプリを作る。
- ベストプラクティスと言えるようなコードを目指す。
    - コードをRAGとして提供し、AIによるコード出力の精度を高めたい。

## 主な構成

- フロントエンド
    - Quasar (Vue + Router + Pinia) による SPA
- バックエンド
    - Azure Functions
- 言語
    - Typescript
- クラウドサービス
    - Azure 

個人的には JSDoc + TS(あくまでも入力補完用)で開発する方が効率が良いと感じているが、AI と TS の親和性が高いとの噂を信じて、どこまでやってくれるかを検証しつつ進めたい。

クラウドサービスは、使い倒せばある意味安いMS365(Azure)を利用する。

- Functions
- Cosmos DB

## 環境構築

```bash
# 最新LTSに固定
node -v > .node-version
# corepack を有効化
corepack enable
# pnpm を有効化
corepack prepare pnpm@latest --activate
# package の初期化
pnpm init
```