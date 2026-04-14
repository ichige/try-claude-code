# Azure Function API



## デプロイ

```bash
# azure-functions-core-tools をインストールしておく。
npm install -g azure-functions-core-tools@4
```

```bash
# 作業ディレクトリへ
cd apps/api
# ログインする
az login
# デプロイ実行
func azure functionapp publish shisamo-local
```