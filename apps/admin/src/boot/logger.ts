import { defineBoot } from '#q-app/wrappers'
import { Telemetry, type Logger } from '@shisamo/shared'

const telemetry = new Telemetry()

/**
 * プレフィックス付きの Logger を生成する。
 * @param prefix メッセージの先頭に付与するラベル
 */
export const getLogger = <TEventName extends string = string>(prefix: string): Logger<TEventName> =>
  telemetry.getLogger<TEventName>(prefix)

/** `admin` プレフィックス付きのデフォルト Logger */
export const logger = telemetry.getLogger('admin')

export default defineBoot(({ app }) => {
  app.config.globalProperties.$logger = logger
})
