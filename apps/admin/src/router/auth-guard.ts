import { type NavigationGuard } from 'vue-router'
import { Loading } from 'quasar'
import { Pipeline } from '@shisamo/shared'
import { useAuthStore } from 'src/stores/auth'
import { getLogger } from 'src/boot/logger'

const logger = getLogger('authGuard')

type Ctx = { state: string }

const authGuard: NavigationGuard = async (to, from, next) => {
  const authStore = useAuthStore()

  try {
    await Pipeline.send<Ctx>({ state: 'pending' })
      // パブリックルートはスキップ
      .pipe(async (ctx, _next) => {
        if (to.meta.public) {
          ctx.state = 'public'
          return ctx
        }
        return _next(ctx)
      })
      // 認証済みはスキップ
      .pipe(async (ctx, _next) => {
        if (authStore.account) {
          ctx.state = 'authenticated'
          return ctx
        }
        return _next(ctx)
      })
      // ローディング表示（login が終わるまで表示し続ける）
      .pipe(async (ctx, _next) => {
        Loading.show({ message: '資格情報の確認中...' })
        try {
          return await _next(ctx)
        } finally {
          Loading.hide()
        }
      })
      .then(async (ctx) => {
        await authStore.login({ scopes: ['User.Read'] })
        ctx.state = 'ok'
        return ctx
      })
    next()
  } catch (e) {
    logger.error(e instanceof Error ? e : new Error(String(e)))
    next({ name: 'fallback' })
  }
}

export default authGuard
