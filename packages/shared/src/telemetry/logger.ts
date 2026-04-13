import type { ApplicationInsights } from '@microsoft/applicationinsights-web';
import { SeverityLevel } from '@microsoft/applicationinsights-web';

/**
 * ログ出力時に付与できる任意のプロパティ
 */
export type LogProperties = Record<string, unknown>;

/**
 * Logger の生成オプション
 */
export interface LoggerOptions {
  /** メッセージの先頭に付与するラベル（例: "MyComponent"） */
  prefix?: string;
}

/**
 * SPA向け共通 Logger
 *
 * 型引数 `TEventName` にアプリ側で定義したイベント名の型を渡すことで、
 * `event` メソッドで送信可能なイベントを制限できます。
 *
 * 各メソッドの properties は Record 型ですが、
 * message キーを含めると message 引数とマージされてしまうので、注意が必要。
 *
 * @example
 * // アプリ側でイベント名を定義
 * const EventName = {
 *   UserLogin: 'user:login',
 *   ButtonClick: 'button:click',
 * } as const;
 * type EventName = (typeof EventName)[keyof typeof EventName];
 *
 * // Logger を初期化
 * const logger = new Logger<EventName>(appInsights);
 * const componentLogger = logger.getLogger('MyComponent');
 * componentLogger.info('initialized'); // → "[MyComponent] initialized"
 * componentLogger.event(EventName.UserLogin, { userId: '123' });
 */
export class Logger<TEventName extends string = string> {
  constructor(
    private readonly appInsights: ApplicationInsights,
    private readonly options?: LoggerOptions,
  ) {}

  /**
   * Debug Level
   */
  debug(message: string, properties?: LogProperties): void {
    this.log(SeverityLevel.Verbose, message, properties);
  }

  /**
   * Info Level
   */
  info(message: string, properties?: LogProperties): void {
    this.log(SeverityLevel.Information, message, properties);
  }

  /**
   * Warning Level
   */
  warn(message: string, properties?: LogProperties): void {
    this.log(SeverityLevel.Warning, message, properties);
  }

  /**
   * エラーレベルのログを出力する
   *
   * - `Error` オブジェクトを渡した場合はスタックトレースも含めて送信します。
   * - 文字列を渡した場合はメッセージとして送信します。
   */
  error(message: string | Error, properties?: LogProperties): void {
    if (message instanceof Error) {
      this.appInsights.trackException(
        { exception: message, severityLevel: SeverityLevel.Error },
        { ...properties, prefix: this.options?.prefix },
      );
    } else {
      this.log(SeverityLevel.Error, message, properties);
    }
  }

  /**
   * カスタムイベントを送信する
   *
   * `name` はアプリ側で型引数 `TEventName` として指定した値のみ受け付けます。
   * prefix は付与されません。
   */
  event(name: TEventName, properties?: LogProperties): void {
    this.appInsights.trackEvent({ name }, properties);
  }

  /**
   * 共通ログ送信処理
   */
  private log(
    severityLevel: SeverityLevel,
    message: string,
    properties?: LogProperties,
  ): void {
    this.appInsights.trackTrace(
      { message: this.formatMessage(message), severityLevel },
      properties,
    );
  }

  /**
   * message のフォーマッタ
   */
  private formatMessage(message: string): string {
    const { prefix } = this.options ?? {};
    return prefix ? `[${prefix}] ${message}` : message;
  }
}
