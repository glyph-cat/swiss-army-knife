/* eslint-disable no-console */

// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom'

type IConsole = typeof console
type ConsoleKey = keyof IConsole

const consoleMethodNames: Array<ConsoleKey> = [
  'log',
  'info',
  'warn',
  'error',
]

const originalMethods: Partial<Record<ConsoleKey, IConsole[ConsoleKey]>> = {}

// todo: [low priority] use `jest.spyOn`

beforeEach(() => {
  for (const consoleMethodName of consoleMethodNames) {
    originalMethods[consoleMethodName] = console[consoleMethodName]
    // @ts-expect-error This is a wrapper, type-wise, it should be safe.
    console[consoleMethodName] = jest.fn(originalMethods[consoleMethodName])
    // console[consoleMethodName] = jest.fn()
  }
})

afterEach(() => {
  for (const consoleMethodName of consoleMethodNames) {
    // @ts-expect-error Once again, type-wise, it should be safe...
    console[consoleMethodName] = originalMethods[consoleMethodName]
  }
})
