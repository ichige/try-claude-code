import { app } from '@azure/functions'
import { getItem } from '../actions/get-item'
import { listItems } from '../actions/list-items'

/**
 * アイテム一覧取得
 */
app.http('cosmos-list', {
  methods: ['GET'],
  route: '{container}',
  authLevel: 'anonymous',
  handler: listItems,
})

/**
 * アイテム1件取得
 */
app.http('cosmos-get', {
  methods: ['GET'],
  route: '{container}/{id}',
  authLevel: 'anonymous',
  handler: getItem,
})
