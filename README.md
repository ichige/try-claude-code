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

共通ライブラリのシンボリックリンク生成。

```bash
pnpm add @shisamo/shared --workspace --filter @shisamo/admin
```

pnpm の node_modules 管理において、IDE が import パスを解決出来ないケースがある。  
その場合は `.npmrc` に `public-hoist-pattern` として登録しておく事で、node_modules 直下にパッケージが展開されるため、パスを解決出来るようになる。  

```
public-hoist-pattern[]=vite
```

### tsconfig.json

Quasar はビルドなどのタイミングで動的に `.quasar/tsconfig.json` を生成する。  
`admin/tsconfig.json` ではこのファイルを extends しているが、設定を拡張する場合は `quasar.config.ts` で行う方が混乱が少なくなる。

```ts
typescript: {
  strict: true,
  vueShim: true,
  extendTsConfig (tsConfig) {
    // tsconfig.json の拡張
    tsConfig.compilerOptions ??= {};
    tsConfig.compilerOptions.paths ??= {};
    tsConfig.compilerOptions.paths['@shisamo/shared'] = ['../../../packages/shared/src/*'];
    tsConfig.compilerOptions.paths['@/*'] = ["../src/*"];
    tsConfig.include ??= [];
    tsConfig.include.push('../../../packages/shared/src/**/*');
  }
},
```