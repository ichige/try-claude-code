import { beforeEach, describe, expect, it, vi } from 'vitest'
import type { ApplicationInsights } from '@microsoft/applicationinsights-web'
import { Logger } from './logger'

vi.mock('@microsoft/applicationinsights-web', () => ({
  SeverityLevel: {
    Verbose: 0,
    Information: 1,
    Warning: 2,
    Error: 3,
    Critical: 4,
  },
}))

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const createMockAppInsights = () => ({
  trackTrace: vi.fn(),
  trackException: vi.fn(),
  trackEvent: vi.fn(),
})

type MockAppInsights = ReturnType<typeof createMockAppInsights>

const createLogger = (mock: MockAppInsights, prefix?: string) =>
  new Logger(
    mock as unknown as ApplicationInsights,
    prefix ? { prefix } : undefined,
  )

// ---------------------------------------------------------------------------
// debug
// ---------------------------------------------------------------------------

describe('debug', () => {
  let mock: MockAppInsights

  beforeEach(() => {
    mock = createMockAppInsights()
  })

  it('trackTrace を SeverityLevel.Verbose で呼び出す', () => {
    createLogger(mock).debug('test message')

    expect(mock.trackTrace).toHaveBeenCalledWith(
      { message: 'test message', severityLevel: 0 },
      undefined,
    )
  })

  it('properties を渡せる', () => {
    createLogger(mock).debug('msg', { key: 'value' })

    expect(mock.trackTrace).toHaveBeenCalledWith(
      { message: 'msg', severityLevel: 0 },
      { key: 'value' },
    )
  })
})

// ---------------------------------------------------------------------------
// info
// ---------------------------------------------------------------------------

describe('info', () => {
  let mock: MockAppInsights

  beforeEach(() => {
    mock = createMockAppInsights()
  })

  it('trackTrace を SeverityLevel.Information で呼び出す', () => {
    createLogger(mock).info('test message')

    expect(mock.trackTrace).toHaveBeenCalledWith(
      { message: 'test message', severityLevel: 1 },
      undefined,
    )
  })
})

// ---------------------------------------------------------------------------
// warn
// ---------------------------------------------------------------------------

describe('warn', () => {
  let mock: MockAppInsights

  beforeEach(() => {
    mock = createMockAppInsights()
  })

  it('trackTrace を SeverityLevel.Warning で呼び出す', () => {
    createLogger(mock).warn('test message')

    expect(mock.trackTrace).toHaveBeenCalledWith(
      { message: 'test message', severityLevel: 2 },
      undefined,
    )
  })
})

// ---------------------------------------------------------------------------
// error
// ---------------------------------------------------------------------------

describe('error', () => {
  let mock: MockAppInsights

  beforeEach(() => {
    mock = createMockAppInsights()
  })

  it('文字列を渡した場合は trackTrace を SeverityLevel.Error で呼び出す', () => {
    createLogger(mock).error('error message')

    expect(mock.trackTrace).toHaveBeenCalledWith(
      { message: 'error message', severityLevel: 3 },
      undefined,
    )
  })

  it('Error オブジェクトを渡した場合は trackException を呼び出す', () => {
    const error = new Error('something went wrong')
    createLogger(mock).error(error)

    expect(mock.trackException).toHaveBeenCalledWith(
      { exception: error, severityLevel: 3 },
      { prefix: undefined },
    )
    expect(mock.trackTrace).not.toHaveBeenCalled()
  })
})

// ---------------------------------------------------------------------------
// event
// ---------------------------------------------------------------------------

describe('event', () => {
  let mock: MockAppInsights

  beforeEach(() => {
    mock = createMockAppInsights()
  })

  it('trackEvent を指定のイベント名で呼び出す', () => {
    createLogger(mock).event('button:click')

    expect(mock.trackEvent).toHaveBeenCalledWith(
      { name: 'button:click' },
      undefined,
    )
  })

  it('properties を渡せる', () => {
    createLogger(mock).event('form:submit', { formId: 'login' })

    expect(mock.trackEvent).toHaveBeenCalledWith(
      { name: 'form:submit' },
      { formId: 'login' },
    )
  })
})

// ---------------------------------------------------------------------------
// prefix
// ---------------------------------------------------------------------------

describe('prefix', () => {
  let mock: MockAppInsights

  beforeEach(() => {
    mock = createMockAppInsights()
  })

  it('メッセージに [prefix] を付与する', () => {
    createLogger(mock, 'MyComponent').info('initialized')

    expect(mock.trackTrace).toHaveBeenCalledWith(
      { message: '[MyComponent] initialized', severityLevel: 1 },
      undefined,
    )
  })

  it('prefix がない場合はメッセージをそのまま送信する', () => {
    createLogger(mock).info('initialized')

    expect(mock.trackTrace).toHaveBeenCalledWith(
      { message: 'initialized', severityLevel: 1 },
      undefined,
    )
  })

  it('Error オブジェクトの場合は prefix を properties に付与する', () => {
    const error = new Error('oops')
    createLogger(mock, 'MyComponent').error(error)

    expect(mock.trackException).toHaveBeenCalledWith(
      { exception: error, severityLevel: 3 },
      { prefix: 'MyComponent' },
    )
  })
})

