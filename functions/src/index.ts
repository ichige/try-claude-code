import { app } from '@azure/functions'
import { handleNotFoundError, handlePreconditionFailedError, handleValidationError, logUnhandledError } from './hooks'
import { Pipeline } from './shared/index.node'

app.setup({
  enableHttpStream: true,
})

app.hook.postInvocation(async (ctx) => {
  if (!ctx.error) return

  await Pipeline.send(ctx)
    .pipe(handleNotFoundError)
    .pipe(handlePreconditionFailedError)
    .pipe(handleValidationError)
    .pipe(logUnhandledError)
    .thenReturn()
})
