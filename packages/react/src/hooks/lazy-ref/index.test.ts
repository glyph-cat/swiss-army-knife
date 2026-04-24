import { CleanupManager } from '@glyph-cat/cleanup-manager'
import { HookTester } from '@glyph-cat/react-test-utils'
import { useReducer } from 'react'
import { useLazyRef } from '.'

let cleanupManager: CleanupManager
beforeEach(() => { cleanupManager = new CleanupManager() })
afterEach(() => { cleanupManager.run() })

test(useLazyRef.name, () => {

  const factory = jest.fn(() => 42)

  const tester = new HookTester({
    useHook: () => {
      const constant = useLazyRef(factory)
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
  expect(tester.hookReturnedValue.constant).toStrictEqual({ current: 42 })
  expect(tester.renderCount).toBe(1)

  tester.action('forceUpdate')
  expect(factory).toHaveBeenCalledTimes(1)
  expect(tester.hookReturnedValue.constant).toStrictEqual({ current: 42 })
  expect(tester.renderCount).toBe(2)

})
