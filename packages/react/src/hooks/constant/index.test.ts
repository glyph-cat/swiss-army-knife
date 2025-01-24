import { CleanupManager } from '@glyph-cat/cleanup-manager'
import { HookTester } from '@glyph-cat/react-test-utils'
import { useReducer } from 'react'
import { useConstant } from '.'

let cleanupManager: CleanupManager
beforeEach(() => { cleanupManager = new CleanupManager() })
afterEach(() => { cleanupManager.run() })

test('Value', () => {

  const tester = new HookTester({
    useHook: () => useConstant(42),
  }, cleanupManager)

  expect(tester.hookReturnedValue).toBe(42)
  expect(tester.renderCount).toBe(1)

})

test('Factory', () => {

  const factory = jest.fn(() => 42)

  const tester = new HookTester({
    useHook: () => {
      const constant = useConstant(factory)
      const [, forceUpdate] = useReducer(c => c + 1, 0)
      return { constant, forceUpdate }
    },
    actions: {
      forceUpdate: (hookData) => {
        hookData.forceUpdate()
      },
    },
  }, cleanupManager)

  expect(factory).toHaveBeenCalledTimes(1)
  expect(tester.hookReturnedValue.constant).toBe(42)
  expect(tester.renderCount).toBe(1)

  tester.action('forceUpdate')
  expect(factory).toHaveBeenCalledTimes(1)
  expect(tester.hookReturnedValue.constant).toBe(42)
  expect(tester.renderCount).toBe(2)

})
