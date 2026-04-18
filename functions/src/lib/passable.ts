import type { HttpRequest, HttpResponseInit } from '@azure/functions'

/**
 * Pipeline に渡すパッサブルオブジェクト。
 * HTTP リクエストと Zod 検証済みのデータをまとめて保持する。
 * @typeParam P - Zod 検証済みの path パラメータの型
 * @typeParam Q - Zod 検証済みの query パラメータの型
 */
export class Passable<
  P extends Record<string, string> = Record<string, string>,
  Q extends Record<string, string> = Record<string, string>,
> {
  request: HttpRequest
  response: HttpResponseInit
  params: P
  query: Q
  body: unknown

  /**
   * @param request - Azure Functions の HTTP リクエスト
   */
  constructor(request: HttpRequest) {
    this.request = request
    this.response = {
      status: 200,
      jsonBody: { success: true },
    }
    this.params = {} as P
    this.query = {} as Q
    this.body = {}
  }

  /**
   * path パラメータをマージする。
   * @param data - マージするデータ
   * @returns this
   */
  mergeParams(data: Record<string, string>): this {
    Object.assign(this.params, data)
    return this
  }

  /**
   * query パラメータをマージする。
   * @param data - マージするデータ
   * @returns this
   */
  mergeQuery(data: Record<string, string>): this {
    Object.assign(this.query, data)
    return this
  }

  /**
   * body をマージする。body がオブジェクトの場合に使用する。
   * @param data - マージするデータ
   * @returns this
   */
  mergeBody(data: Record<string, unknown>): this {
    Object.assign(this.body as Record<string, unknown>, data)
    return this
  }

  /**
   * body をセットする。オブジェクト・配列など任意の値に使用する。
   * @param data - セットするデータ
   * @returns this
   */
  setBody(data: unknown): this {
    this.body = data
    return this
  }

  /**
   * path パラメータをフィールド指定で取得する。
   * @param key - 取得するフィールド名
   * @param defaultValue - フィールドが存在しない場合のデフォルト値
   * @returns フィールドの値
   */
  getParam(key: keyof P & string, defaultValue?: string): string | undefined {
    return (this.params[key] as string | undefined) ?? defaultValue
  }

  /**
   * query パラメータをフィールド指定で取得する。
   * @param key - 取得するフィールド名
   * @param defaultValue - フィールドが存在しない場合のデフォルト値
   * @returns フィールドの値
   */
  getQuery(key: keyof Q & string, defaultValue?: string): string | undefined {
    return (this.query[key] as string | undefined) ?? defaultValue
  }

  /**
   * body をフィールド指定で取得する。body がオブジェクトの場合に使用する。
   * @param key - 取得するフィールド名
   * @param defaultValue - フィールドが存在しない場合のデフォルト値
   * @returns フィールドの値
   */
  getBody<V = unknown>(key: string, defaultValue?: V): V | undefined {
    return ((this.body as Record<string, unknown>)[key] as V | undefined) ?? defaultValue
  }
}
