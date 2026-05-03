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
# ビルド実行
npm run build
# デプロイ実行
func azure functionapp publish shisamo-api
```

### 環境変数の設定

環境変数は Azure Function に設定するため、CLI で行うことにする。  
※ ポータルで設定してもOK。

```bash
# 作業ディレクトリへ
cd functions
# ログインする
az login
# CLI実行する
az functionapp config appsettings set \
  --name shisamo-api \
  --resource-group shisamo-local_group \
  --settings \
    COSMOS_ENDPOINT="https://shisamo-local.documents.azure.com:443/" \
    COSMOS_DATABASE="shisamo-db"
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
