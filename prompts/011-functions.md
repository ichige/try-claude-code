# Azure Functions の土台を構成する

apps/functions 配下に Azure Functions の環境を構成する。

## prompt

```markdown
`apps` の配下に Azure Functions の環境 `functions` を構成してほしい。
- 言語はSPAと同じくTypescriptで。
- いわゆる Rest API のエンドポイントを何個か作る。
- 各APIで共通のライブラリを利用する想定。
- とりあえず入門となる hello-world エンドポイントを用意して。
```

それっぽいものが出来た。
デプロイまで出来るように進める。

デプロイしてみたところ、node_modules などが dist に入ってないので、Functions が起動しないようである。

```markdown
pnpm だと node_modules が dist に複製されないようなので、esbuild を使って調整してみてくれ。
```

- [esbuild](https://esbuild.github.io/)

さらに共通パッケージに問題があるらしい。
そこの依存解決が出来てない臭い。

```markdown
esbuild を使って src/functions 以下の TS ファイルをビルドし、@shisamo/shared を含む依存をバンドルして dist に出力するビルドスクリプトを作成してください。package.json の build スクリプトも合わせて更新してください。
```

しかし、色々調べたところ、以前 Github Actions からデプロイしていたことで、不整合が出ていたようで動かなかった。  
のちほど新規で作り直す。
