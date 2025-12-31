import { CleanupManager } from '@glyph-cat/cleanup-manager'
import { HookTester } from '@glyph-cat/react-test-utils'
import { JSX } from 'react'
import { renderToString } from 'react-dom/server'
import { useHydrationState } from '.'
import { RuntimeContext, RuntimeManager } from '../../../runtime-manager'
import { useForceUpdate } from '../../force-update'

let cleanupManager: CleanupManager
beforeEach(() => { cleanupManager = new CleanupManager() })
afterEach(() => { cleanupManager.run() })

let runtimeManager: RuntimeManager
beforeEach(() => { runtimeManager = new RuntimeManager() })
afterEach(() => { runtimeManager = null })

test('Server-side rendering', () => {
  function TestComponent(): JSX.Element {
    return <>{String(useHydrationState())}</>
  }
  expect(renderToString(<TestComponent />)).toBe(String(false))
})

describe('Client-side rendering', () => {

  test('First render', () => {

    const tester = new HookTester({
      useHook: () => {
        const isHydrated = useHydrationState()
        const forceUpdate = useForceUpdate()
        return { isHydrated, forceUpdate }
      },
      actions: {
        forceUpdate: (hookData) => { hookData.forceUpdate() },
      },
      get: {
        value: (hookData) => hookData.isHydrated,
      },
      wrapper: ({ children }) => (
        <RuntimeContext value={runtimeManager}>
          {children}
        </RuntimeContext>
      ),
    }, cleanupManager)

    expect(tester.renderCount).toBe(2)
    expect(tester.get('value')).toBe(true)

    tester.action('forceUpdate')
    expect(tester.get('value')).toBe(true)

  })

  test('Subsequent render', () => {

    // Simulate that hydration has already completed
    runtimeManager.M$hydrationState.set(true)

    const tester = new HookTester({
      useHook: () => {
        const isHydrated = useHydrationState()
        const forceUpdate = useForceUpdate()
        return { isHydrated, forceUpdate }
      },
      actions: {
        forceUpdate: (hookData) => { hookData.forceUpdate() },
      },
      get: {
        value: (hookData) => hookData.isHydrated,
      },
      wrapper: ({ children }) => (
        <RuntimeContext value={runtimeManager}>
          {children}
        </RuntimeContext>
      ),
    }, cleanupManager)

    expect(tester.renderCount).toBe(1)
    expect(tester.get('value')).toBe(true)

  })

})
