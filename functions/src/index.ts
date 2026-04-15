import { app } from '@azure/functions'

app.setup({
  enableHttpStream: true,
})

app.hook.postInvocation(async (ctx) => {
  if (!ctx.error) return

  const error = ctx.error
  if (error instanceof Error && 'statusCode' in error && typeof error.statusCode === 'number') {
    ctx.result = { status: error.statusCode, jsonBody: { error: error.message } }
    ctx.error = undefined
    return
  }

  ctx.invocationContext.error('Unhandled error:', error)
  ctx.result = { status: 500, jsonBody: { error: 'Internal Server Error' } }
  ctx.error = undefined
})
