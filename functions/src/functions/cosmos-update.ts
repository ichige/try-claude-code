import { app } from '@azure/functions';
import { updateItem } from '../actions/update-item';
import { replaceItem } from '../actions/replace-item';
import { bulkUpdateItems } from '../actions/bulk-update-items';
import { bulkReplaceItems } from '../actions/bulk-replace-items';

app.http('cosmos-update', {
  methods: ['PATCH'],
  route: '{container}/{id}',
  authLevel: 'anonymous',
  handler: updateItem,
});

app.http('cosmos-replace', {
  methods: ['POST'],
  route: '{container}/{id}',
  authLevel: 'anonymous',
  handler: replaceItem,
});

app.http('cosmos-bulk-update', {
  methods: ['PATCH'],
  route: '{container}/bulk',
  authLevel: 'anonymous',
  handler: bulkUpdateItems,
});

app.http('cosmos-bulk-replace', {
  methods: ['POST'],
  route: '{container}/bulk',
  authLevel: 'anonymous',
  handler: bulkReplaceItems,
});
