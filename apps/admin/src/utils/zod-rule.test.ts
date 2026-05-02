import { describe, it, expect } from 'vitest'
import { z } from 'zod'
import { zodRule } from './zod-rule'

describe('zodRule', () => {
  it('スキーマが通る場合は true を返す', async () => {
    const rule = zodRule(z.string().min(1))
    expect(await rule('hello')).toBe(true)
  })

  it('スキーマが失敗する場合はエラーメッセージを返す', async () => {
    const rule = zodRule(z.string().min(1, '必須です'))
    expect(await rule('')).toBe('必須です')
  })

  it('fieldLabel が指定されている場合は {field} を置換する', async () => {
    const schema = z.string().min(1, '{field}は必須です')
    const rule = zodRule(schema, '名前')
    expect(await rule('')).toBe('名前は必須です')
  })

  it('fieldLabel が未指定の場合は {field} を空文字に置換する', async () => {
    const schema = z.string().min(1, '{field}は必須です')
    const rule = zodRule(schema)
    expect(await rule('')).toBe('は必須です')
  })

  it('数値スキーマで正常値は true を返す', async () => {
    const rule = zodRule(z.number().min(0, '0以上にしてください'))
    expect(await rule(1)).toBe(true)
  })

  it('数値スキーマで不正値はエラーメッセージを返す', async () => {
    const rule = zodRule(z.number().min(0, '0以上にしてください'))
    expect(await rule(-1)).toBe('0以上にしてください')
  })
})
