type IConsole = typeof console
type ConsoleKey = keyof IConsole

const consoleMethodNames: Array<ConsoleKey> = [
  'log',
  'info',
  'warn',
  'error',
]

const originalMethods: Partial<Record<ConsoleKey, IConsole[ConsoleKey]>> = {}

beforeEach(() => {
  for (const consoleMethodName of consoleMethodNames) {
    originalMethods[consoleMethodName] = console[consoleMethodName]
    // @ts-expect-error: because we are forcefully replacing the implementation
    console[consoleMethodName] = jest.fn(originalMethods[consoleMethodName])
  }
})

afterEach(() => {
  for (const consoleMethodName of consoleMethodNames) {
    // @ts-expect-error: because we are forcefully replacing the implementation
    console[consoleMethodName] = jest.fn(originalMethods[consoleMethodName])
  }
})
