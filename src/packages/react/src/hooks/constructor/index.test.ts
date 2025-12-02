import { CleanupManager } from '@glyph-cat/cleanup-manager'
import { IDisposable } from '@glyph-cat/foundation'
import { HookTester } from '@glyph-cat/react-test-utils'
import { useReducer } from 'react'
import { useConstructor } from '.'

let cleanupManager: CleanupManager
beforeEach(() => { cleanupManager = new CleanupManager() })
afterEach(() => { cleanupManager.run() })

let idCounter: number
let disposedTracker: Array<number> = []
beforeEach(() => {
  idCounter = 0
  disposedTracker = []
})

class MockDisposable implements IDisposable {

  readonly id: number = ++idCounter
  dispose(): void { disposedTracker.push(this.id) }

}

test.skip('With Strict Mode', () => {

  const factory = jest.fn(() => new MockDisposable())

  const tester = new HookTester({
    useHook: () => {
      const payload = useConstructor(factory, (instance) => { instance.dispose() })
      const [, forceUpdate] = useReducer((c) => c + 1, 0)
      return { payload, forceUpdate }
    },
    actions: {
      forceUpdate: (hookData) => {
        hookData.forceUpdate()
      },
    },
    strictMode: true,
  }, cleanupManager)

  // expect(factory).toHaveBeenCalledTimes(2)
  expect(disposedTracker).toStrictEqual([1])
  expect(tester.hookReturnedValue.payload.id).toBe(2)
  expect(tester.renderCount).toBe(2)

  tester.action('forceUpdate')
  // expect(factory).toHaveBeenCalledTimes(2)
  expect(disposedTracker).toStrictEqual([1])
  expect(tester.hookReturnedValue.payload.id).toBe(2)
  expect(tester.renderCount).toBe(4)

  tester.renderResult.unmount()
  // expect(factory).toHaveBeenCalledTimes(2)
  expect(disposedTracker).toStrictEqual([1, 2])
  expect(tester.renderCount).toBe(4)

})

test('Without Strict Mode', () => {

  const factory = jest.fn(() => new MockDisposable())

  const tester = new HookTester({
    useHook: () => {
      const payload = useConstructor(factory, (instance) => { instance.dispose() })
      const [, forceUpdate] = useReducer((c) => c + 1, 0)
      return { payload, forceUpdate }
    },
    actions: {
      forceUpdate: (hookData) => {
        hookData.forceUpdate()
      },
    },
  }, cleanupManager)

  expect(factory).toHaveBeenCalledTimes(1)
  expect(disposedTracker).toStrictEqual([])
  expect(tester.hookReturnedValue.payload.id).toBe(1)
  expect(tester.renderCount).toBe(1)

  tester.action('forceUpdate')
  expect(factory).toHaveBeenCalledTimes(1)
  expect(disposedTracker).toStrictEqual([])
  expect(tester.hookReturnedValue.payload.id).toBe(1)
  expect(tester.renderCount).toBe(2)

  tester.renderResult.unmount()
  expect(factory).toHaveBeenCalledTimes(1)
  expect(disposedTracker).toStrictEqual([1])
  expect(tester.renderCount).toBe(2)

})
