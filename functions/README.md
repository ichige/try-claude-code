# Azure Function API



## デプロイ

```bash
# azure-functions-core-tools をインストールしておく。
npm install -g azure-functions-core-tools@4
```

```bash
# 作業ディレクトリへ
cd functions
# ログインする
az login
# デプロイ実行
func azure functionapp publish shisamo-api
```

## ローカルサーバの起動

```bash
# 作業ディレクトリへ
cd functions
# ログインする
az login
# azurite 起動(別ターミナル)
npx azurite --silent --location .azurite
# サーバ起動
npm run dev
```