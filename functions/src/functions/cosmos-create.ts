import { app } from '@azure/functions';
import { createItem } from '../actions/create-item';
import { bulkCreateItems } from '../actions/bulk-create-items';

/**
 * アイテム作成
 */
app.http('cosmos-create', {
  methods: ['POST'],
  route: '{container}',
  authLevel: 'anonymous',
  handler: createItem,
});

/**
 * アイテムバルク作成
 */
app.http('cosmos-bulk-create', {
  methods: ['POST'],
  route: '{container}/bulk',
  authLevel: 'anonymous',
  handler: bulkCreateItems,
});
