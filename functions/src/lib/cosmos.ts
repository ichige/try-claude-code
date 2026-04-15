import { CosmosClient } from '@azure/cosmos'
import { DefaultAzureCredential } from '@azure/identity'

const endpoint = process.env.COSMOS_ENDPOINT

if (!endpoint) {
  throw new Error('COSMOS_ENDPOINT is not set')
}

const credential = new DefaultAzureCredential()

/**
 * アプリケーション全体で共有する CosmosClient のシングルトン。
 * 認証には DefaultAzureCredential を使用する（Managed Identity / 環境変数 / CLI 等を自動選択）。
 */
export const cosmosClient = new CosmosClient({ endpoint, aadCredentials: credential })
