import { app } from '@azure/functions'
import { bulkCreateItems } from '../actions/bulk-create-items'
import { createItem } from '../actions/create-item'

/**
 * アイテム作成
 */
app.http('cosmos-create', {
  methods: ['POST'],
  route: 'create-item/{container}',
  authLevel: 'anonymous',
  handler: createItem,
})

/**
 * アイテムバルク作成
 */
app.http('cosmos-bulk-create', {
  methods: ['POST'],
  route: 'bulk-create/{container}',
  authLevel: 'anonymous',
  handler: bulkCreateItems,
})
