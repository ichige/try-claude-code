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

デプロイ自体は出来るものの、関数が読み込まれない。  
何か問題があるようなので、問題の切り分けを行う。

```markdown
プロジェクトルート直下に `functions` ディレクトリを作成し、Azure Functions の v4開発環境を構成してほしい。
- 言語は typescript とする。
- pnpm workspace から独立した npm で構成する。
- http トリガーの最も単純な hello world 関数を用意する。
```

いまいちなので、追加注文をする。

```markdown
- main に `dist/src/{index.js,functions/*.js}` を指定するのでは？ 
```

これはあっさり動いた。  
pnpm 環境が問題あるかもしれない。

```markdown
この `functions` と同じ構成で `apps/api` を作り直して。
- こちらは pnpm 環境とする。
- README.md 意外は削除してやり直して問題ない。
- まずは余計なことを考えずに、あくまで `functions` を複製することに集中すること。 
```

思考錯誤を栗化したが、やはり pnpm 環境では Functions へのデプロイが難しい(管理が大変)という判断となった。  
workspace から除外してルート直下の `functions` ディレクトリで npm 管理とする。

`packages/shared` はシンボリックリンクにて `functions/src` 配下に配置する。  

```markdown
post install で `packages/shared` はシンボリックリンクにて `functions/src` 配下に作るスクリプトを用意して。
```

[esbuild](https://esbuild.github.io/) を利用してバンドルする形にした。  
Functions でも1関数1ファイルになるので、理論的に軽量化されることになる。