import { CleanupManager } from '@glyph-cat/cleanup-manager'
import { HookTester } from '@glyph-cat/react-test-utils'
import { useDebouncedCallback } from '.'

let cleanupManager: CleanupManager
beforeEach(() => { cleanupManager = new CleanupManager() })
afterEach(() => { cleanupManager.run() })

test('Invocations overlap', () => {

  const spyFn = jest.fn()

  const tester = new HookTester({
    useHook: () => useDebouncedCallback(spyFn, 100),
    actions: {
      invoke(debouncedCallback) {
        debouncedCallback()
      },
    },
  }, cleanupManager)

  tester.action('invoke', 'invoke')
  jest.advanceTimersByTime(100)

  expect(spyFn).toHaveBeenCalledTimes(1)

})

test('Invocations do not overlap', () => {

  const spyFn = jest.fn()

  const tester = new HookTester({
    useHook: () => useDebouncedCallback(spyFn, 100),
    actions: {
      invoke(debouncedCallback) {
        debouncedCallback()
      },
    },
  }, cleanupManager)

  tester.action('invoke')
  jest.advanceTimersByTime(150)
  tester.action('invoke')
  jest.advanceTimersByTime(100)

  expect(spyFn).toHaveBeenCalledTimes(2)

})
