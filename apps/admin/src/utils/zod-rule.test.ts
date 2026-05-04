import { describe, it, expect } from 'vitest'
import { z } from 'zod'
import { zodRule } from './zod-rule'

describe('zodRule', () => {
  it('スキーマが通る場合は true を返す', () => {
    const rule = zodRule(z.string().min(1))
    expect(rule('hello')).toBe(true)
  })

  it('スキーマが失敗する場合はエラーメッセージを返す', () => {
    const rule = zodRule(z.string().min(1, '必須です'))
    expect(rule('')).toBe('必須です')
  })

  it('スキーマにフィールド名を含むメッセージはそのまま返す', () => {
    const rule = zodRule(z.string().min(1, '名前は必須です'))
    expect(rule('')).toBe('名前は必須です')
  })

  it('数値スキーマで正常値は true を返す', () => {
    const rule = zodRule(z.number().min(0, '0以上にしてください'))
    expect(rule(1)).toBe(true)
  })

  it('数値スキーマで不正値はエラーメッセージを返す', () => {
    const rule = zodRule(z.number().min(0, '0以上にしてください'))
    expect(rule(-1)).toBe('0以上にしてください')
  })
})
