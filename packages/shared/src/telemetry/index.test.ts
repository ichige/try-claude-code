import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { Logger } from './logger'
import { Telemetry } from '.'

// ---------------------------------------------------------------------------
// Mocks
// ---------------------------------------------------------------------------

const { mockLoadAppInsights, mockTrackTrace, MockApplicationInsights } =
  vi.hoisted(() => {
    const mockLoadAppInsights = vi.fn()
    const mockTrackTrace = vi.fn()
    // アロー関数はコンストラクタとして使えないため通常の function を使用する
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const MockApplicationInsights = vi.fn(function (this: any) {
      this.loadAppInsights = mockLoadAppInsights
      this.trackTrace = mockTrackTrace
      this.trackException = vi.fn()
      this.trackEvent = vi.fn()
    })
    return { mockLoadAppInsights, mockTrackTrace, MockApplicationInsights }
  })

vi.mock('@microsoft/applicationinsights-web', () => ({
  ApplicationInsights: MockApplicationInsights,
  SeverityLevel: {
    Verbose: 0,
    Information: 1,
    Warning: 2,
    Error: 3,
    Critical: 4,
  },
}))

// ---------------------------------------------------------------------------
// constructor
// ---------------------------------------------------------------------------

describe('constructor', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.unstubAllEnvs()
  })

  it('config の connectionString を ApplicationInsights に渡す', () => {
    new Telemetry({ connectionString: 'InstrumentationKey=from-config' })

    expect(MockApplicationInsights).toHaveBeenCalledWith({
      config: expect.objectContaining({
        connectionString: 'InstrumentationKey=from-config',
      }),
    })
  })

  it('connectionString が未指定の場合は環境変数を使用する', () => {
    vi.stubEnv(
      'VITE_APPLICATIONINSIGHTS_CONNECTION_STRING',
      'InstrumentationKey=from-env',
    )

    new Telemetry()

    expect(MockApplicationInsights).toHaveBeenCalledWith({
      config: expect.objectContaining({
        connectionString: 'InstrumentationKey=from-env',
      }),
    })
  })

  it('config の connectionString が環境変数より優先される', () => {
    vi.stubEnv(
      'VITE_APPLICATIONINSIGHTS_CONNECTION_STRING',
      'InstrumentationKey=from-env',
    )

    new Telemetry({ connectionString: 'InstrumentationKey=from-config' })

    expect(MockApplicationInsights).toHaveBeenCalledWith({
      config: expect.objectContaining({
        connectionString: 'InstrumentationKey=from-config',
      }),
    })
  })
})

// ---------------------------------------------------------------------------
// load
// ---------------------------------------------------------------------------

describe('load', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('loadAppInsights を呼び出す', () => {
    const telemetry = new Telemetry({ connectionString: 'test' })
    telemetry.load()

    expect(mockLoadAppInsights).toHaveBeenCalledOnce()
  })
})

// ---------------------------------------------------------------------------
// getLogger
// ---------------------------------------------------------------------------

describe('getLogger', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('Logger インスタンスを返す', () => {
    const logger = new Telemetry({ connectionString: 'test' }).getLogger('X')

    expect(logger).toBeInstanceOf(Logger)
  })

  it('prefix が設定された Logger を返す', () => {
    const telemetry = new Telemetry({ connectionString: 'test' })
    const logger = telemetry.getLogger('MyComponent')
    logger.info('hello')

    expect(mockTrackTrace).toHaveBeenCalledWith(
      { message: '[MyComponent] hello', severityLevel: 1 },
      undefined,
    )
  })

  it('異なる prefix の Logger は独立している', () => {
    const telemetry = new Telemetry({ connectionString: 'test' })
    const loggerA = telemetry.getLogger('A')
    const loggerB = telemetry.getLogger('B')

    loggerA.info('from A')
    loggerB.info('from B')

    expect(mockTrackTrace).toHaveBeenCalledWith(
      { message: '[A] from A', severityLevel: 1 },
      undefined,
    )
    expect(mockTrackTrace).toHaveBeenCalledWith(
      { message: '[B] from B', severityLevel: 1 },
      undefined,
    )
  })
})
