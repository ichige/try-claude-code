import { ApplicationInsights } from '@microsoft/applicationinsights-web'
import type { IConfig, IConfiguration } from '@microsoft/applicationinsights-web'

import { Logger } from './logger'
import type { LoggerOptions } from './logger'
export { Logger }
export type { LoggerOptions }

/**
 * Telemetry の初期化コンフィグ
 *
 * ApplicationInsights の設定をそのまま渡せます。
 * `connectionString` を省略した場合は環境変数 `VITE_APPLICATIONINSIGHTS_CONNECTION_STRING` を使用します。
 */
export type TelemetryConfig = IConfiguration & IConfig

/**
 * Logger の Factory クラス
 *
 * ApplicationInsights インスタンスを1つ保持し、`getLogger` で
 * プレフィックス付きの Logger を生成します。
 *
 * @example
 * const telemetry = new Telemetry({ enableAutoRouteTracking: true });
 * telemetry.load();
 *
 * const logger = telemetry.getLogger<EventName>('MyComponent');
 * logger.info('initialized');
 */
export class Telemetry {
  private readonly appInsights: ApplicationInsights

  constructor(config: TelemetryConfig = {}) {
    const connectionString =
      config.connectionString ??
      (import.meta.env.VITE_APPLICATIONINSIGHTS_CONNECTION_STRING as string)

    this.appInsights = new ApplicationInsights({
      config: { ...config, connectionString },
    })
    this.appInsights.loadAppInsights()
  }

  /**
   * プレフィックス付きの Logger を生成する
   * TEventName はイベント名の Union Type を想定しており、SPA側で定義する。
   * @param prefix メッセージの先頭に付与するラベル
   */
  getLogger<TEventName extends string = string>(prefix: string): Logger<TEventName> {
    const options: LoggerOptions = { prefix }
    return new Logger<TEventName>(this.appInsights, options)
  }
}
