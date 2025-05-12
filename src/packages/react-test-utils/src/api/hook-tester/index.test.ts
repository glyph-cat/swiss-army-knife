import { CleanupManager } from '@glyph-cat/cleanup-manager'
import { useRef, useState } from 'react'
import { HookTester } from '.'
import { ActionNotExistError, ValueNotExistError } from '../../errors'
import { TestUtils } from '../../internal-test-utils'

const cleanupManager = new CleanupManager()
afterEach(() => { cleanupManager.run() })

test('Synchronous execution', (): void => {

  const tester = new HookTester({
    useHook: () => useState(0),
    actions: {
      increaseCounter(hookData) {
        const [, setCounter] = hookData
        setCounter((c: number) => c + 1)
      },
    },
    values: {
      value(hookData) {
        const [counter] = hookData
        return counter
      },
    },
  }, cleanupManager)

  // Initial state
  expect(tester.renderCount).toBe(1)
  expect(tester.get('value')).toBe(0)

  // After increment
  tester.action('increaseCounter')
  expect(tester.renderCount).toBe(2)
  expect(tester.get('value')).toBe(1)

  // After another increment
  tester.action('increaseCounter', 'increaseCounter')
  expect(tester.renderCount).toBe(3)
  expect(tester.get('value')).toBe(3)

  // Non-existent action
  expect(() => {
    // @ts-expect-error Ignored on purpose to test the error
    tester.action('abc')
  }).toThrow(new ActionNotExistError('abc', ['increaseCounter']))

  // Non-existent value
  expect(() => {
    // @ts-expect-error Ignored on purpose to test the error
    tester.get('abc')
  }).toThrow(new ValueNotExistError('abc', ['value']))

})

test('Asynchronous execution', async (): Promise<void> => {

  jest.useRealTimers()

  const tester = new HookTester({
    useHook: () => useState(0),
    actions: {
      async increaseCounter(hookData): Promise<void> {
        const [, setCounter] = hookData
        await TestUtils.delay(100)
        setCounter((c: number) => c + 1)
      },
    },
    values: {
      value(hookData): number {
        const [counter] = hookData
        return counter
      },
    },
  }, cleanupManager)

  // Initial state
  expect(tester.renderCount).toBe(1)
  expect((tester.get('value'))).toBe(0)

  // After increment
  await tester.actionAsync('increaseCounter')
  expect(tester.renderCount).toBe(2)
  expect(tester.get('value')).toBe(1)

  // After another increment
  await tester.actionAsync(
    'increaseCounter',
    'increaseCounter',
  )
  expect(tester.renderCount).toBe(3)
  expect(tester.get('value')).toBe(3)

  // Every set of actions called in `action` or `actionAsync` will be batched.
  await tester.actionAsync(
    'increaseCounter',
    'increaseCounter',
    'increaseCounter',
    'increaseCounter',
  )
  expect(tester.renderCount).toBe(4)
  expect(tester.get('value')).toBe(7)

  // Non-existent action
  await expect(async () => {
    // @ts-expect-error Ignored on purpose to test the error
    await tester.actionAsync('abc')
  }).rejects.toThrow(new ActionNotExistError('abc', ['increaseCounter']))

  // Non-existent value
  expect(() => {
    // @ts-expect-error Ignored on purpose to test the error
    tester.get('abc')
  }).toThrow(new ValueNotExistError('abc', ['value']))

})

test('Hook returned value', () => {

  const tester = new HookTester({
    useHook: () => useRef(42),
  }, cleanupManager)

  expect(tester.hookReturnedValue).toStrictEqual({ current: 42 })

})

test('Value getter causes error', () => {

  const tester = new HookTester({
    useHook: () => useRef(42),
    values: {
      value1() {
        throw new Error('lorem-ipsum')
      },
      value2() {
        return 'OK'
      },
    },
  }, cleanupManager)

  expect(tester.get('value2')).toBe('OK')
  expect(() => { tester.get('value1') }).toThrow(new Error('lorem-ipsum'))

})
