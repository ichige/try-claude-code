import { app } from '@azure/functions'
import { bulkDeleteItems } from '../actions/bulk-delete-items'
import { deleteItem } from '../actions/delete-item'

/**
 * アイテム削除
 */
app.http('cosmos-delete', {
  methods: ['DELETE'],
  route: 'delete-item/{container}/{id}/{pk?}',
  authLevel: 'anonymous',
  handler: deleteItem,
})

/**
 * アイテムバルク削除
 */
app.http('cosmos-bulk-delete', {
  methods: ['POST'],
  route: 'bulk-delete/{container}',
  authLevel: 'anonymous',
  handler: bulkDeleteItems,
})
