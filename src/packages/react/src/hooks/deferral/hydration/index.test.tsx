import { CleanupManager } from '@glyph-cat/cleanup-manager'
import { HookTester } from '@glyph-cat/react-test-utils'
import React, { JSX, useReducer } from 'react'
import { renderToString } from 'react-dom/server'
import { useHydrationState } from '.'
import { GCProvider } from '../../../provider'
import { useForceUpdate } from '../../force-update'
import { baseReducer } from '../internal'

let cleanupManager: CleanupManager
beforeEach(() => { cleanupManager = new CleanupManager() })
afterEach(() => { cleanupManager.run() })

describe(`Without ${GCProvider.name}`, () => {

  test('Server-side rendering', () => {
    function TestComponent(): JSX.Element {
      return <>{String(useHydrationState())}</>
    }
    expect(renderToString(<TestComponent />)).toBe(String(false))
  })

  test('Client-side rendering', () => {

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
    }, cleanupManager)

    expect(tester.renderCount).toBe(2)
    expect(tester.get('value')).toBe(true)

    tester.action('forceUpdate')
    expect(tester.get('value')).toBe(true)

  })

})

describe(`With ${GCProvider.name}`, () => {

  test('Server-side rendering', () => {
    function TestComponent(): JSX.Element {
      return <>{String(useHydrationState())}</>
    }
    expect(renderToString(
      <GCProvider>
        <TestComponent />
      </GCProvider>
    )).toBe(String(false))
  })

  test.skip('Client-side rendering', () => {

    jest.spyOn(React, 'useReducer')

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
        <GCProvider>
          {children}
        </GCProvider>
      ),
    }, cleanupManager)

    expect(useReducer).toHaveBeenCalledWith(baseReducer, true)

    // expect(tester.renderCount).toBe(2)
    // expect(tester.get('value')).toBe(true)

    // tester.action('forceUpdate')
    // expect(tester.get('value')).toBe(true)

  })

})
