import { app } from '@azure/functions'
import { handleNotFoundError, handleValidationError, logUnhandledError } from './hooks'
import { Pipeline } from './shared'

app.setup({
  enableHttpStream: true,
})

app.hook.postInvocation(async (ctx) => {
  if (!ctx.error) return

  await Pipeline.send(ctx)
    .pipe(handleNotFoundError)
    .pipe(handleValidationError)
    .pipe(logUnhandledError)
    .thenReturn()
})
