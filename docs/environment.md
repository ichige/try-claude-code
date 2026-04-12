# 環境構築メモ

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

## tsconfig.json

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
}
```

## HTTPS(SSL)

- [mkcert](https://github.com/filosottile/mkcert)

windows 上で証明書を発行し、wsl2 へコピーすれば利用できます。  
MSAL認証はローカルでもHTTPSである必要がある。

```ts
devServer: {
  // SSL
  https: process.env.CI ? false : {
    key: fs.readFileSync(
      `${process.env.HOME}/.certs/_wildcard.shisamo.local+1-key.pem`,
    ),
    cert: fs.readFileSync(
      `${process.env.HOME}/.certs/_wildcard.shisamo.local+1.pem`,
    ),
  },
  host: 'admin.shisamo.local', 
  fs: {
    // pnpm で親の node_modules を見る場合に必要な設定
    allow: ['../..'],
  },
  open: true, // opens browser window automatically
}
```