import { app } from '@azure/functions'
import { getItem } from '../actions/get-item'
import { listItems } from '../actions/list-items'

/**
 * アイテム一覧取得
 */
app.http('cosmos-list', {
  methods: ['GET'],
  route: 'item-list/{container}/{pk?}',
  authLevel: 'anonymous',
  handler: listItems,
})

/**
 * アイテム1件取得
 */
app.http('cosmos-get', {
  methods: ['GET'],
  route: 'item/{container}/{id}/{pk?}',
  authLevel: 'anonymous',
  handler: getItem,
})
