import { app } from '@azure/functions'
import { bulkReplaceItems } from '../actions/bulk-replace-items'
import { bulkUpdateItems } from '../actions/bulk-update-items'
import { replaceItem } from '../actions/replace-item'
import { updateItem } from '../actions/update-item'

/**
 * アイテム部分更新
 */
app.http('cosmos-update', {
  methods: ['PATCH'],
  route: 'update-item/{container}/{id}',
  authLevel: 'anonymous',
  handler: updateItem,
})

/**
 * アイテム全置換
 */
app.http('cosmos-replace', {
  methods: ['POST'],
  route: 'replace-item/{container}/{id}',
  authLevel: 'anonymous',
  handler: replaceItem,
})

/**
 * アイテムバルク部分更新
 */
app.http('cosmos-bulk-update', {
  methods: ['PATCH'],
  route: 'bulk-update/{container}',
  authLevel: 'anonymous',
  handler: bulkUpdateItems,
})

/**
 * アイテムバルク全置換
 */
app.http('cosmos-bulk-replace', {
  methods: ['POST'],
  route: 'bulk-replace/{container}',
  authLevel: 'anonymous',
  handler: bulkReplaceItems,
})
