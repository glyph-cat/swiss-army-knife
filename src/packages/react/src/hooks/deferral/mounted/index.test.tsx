import { CleanupManager } from '@glyph-cat/cleanup-manager'
import { HookTester } from '@glyph-cat/react-test-utils'
import { JSX } from 'react'
import { renderToString } from 'react-dom/server'
import { useMountedState } from '.'
import { useForceUpdate } from '../../force-update'

let cleanupManager: CleanupManager
beforeEach(() => { cleanupManager = new CleanupManager() })
afterEach(() => { cleanupManager.run() })

test('Server-side rendering', () => {
  function TestComponent(): JSX.Element {
    return <>{String(useMountedState())}</>
  }
  expect(renderToString(<TestComponent />)).toBe(String(false))
})

test('Client-side rendering', () => {

  const tester = new HookTester({
    useHook: () => {
      const isMounted = useMountedState()
      const forceUpdate = useForceUpdate()
      return { isMounted, forceUpdate }
    },
    actions: {
      forceUpdate: (hookData) => { hookData.forceUpdate() },
    },
    get: {
      value: (hookData) => hookData.isMounted,
    },
  }, cleanupManager)

  // 1st render
  expect(tester.renderCount).toBe(2)
  expect(tester.get('value')).toBe(true)

  // subsequent renders
  tester.action('forceUpdate')
  expect(tester.get('value')).toBe(true)

})
