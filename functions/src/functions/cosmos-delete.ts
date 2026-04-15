import { app } from '@azure/functions'
import { deleteItem } from '../actions/delete-item'
import { bulkDeleteItems } from '../actions/bulk-delete-items'

/**
 * アイテム物理削除
 */
app.http('cosmos-delete', {
  methods: ['DELETE'],
  route: '{container}/{id}',
  authLevel: 'anonymous',
  handler: deleteItem,
})

/**
 * アイテムバルク物理削除
 */
app.http('cosmos-bulk-delete', {
  methods: ['POST'],
  route: '{container}/bulk/delete',
  authLevel: 'anonymous',
  handler: bulkDeleteItems,
})
