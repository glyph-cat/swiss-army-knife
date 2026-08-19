import { customRenderHook, CustomRenderHookResult } from '@glyph-cat/react-test-utils'
import { ReactNode } from 'react'
import { renderToString } from 'react-dom/server'
import { useHydrationState } from '.'

let hook: CustomRenderHookResult<boolean, void>
afterEach(() => { hook?.unmount() })

test('Server-side rendering', () => {
  function TestComponent(): ReactNode {
    return <>{String(useHydrationState())}</>
  }
  expect(renderToString(<TestComponent />)).toBe(String(false))
})

describe('Client-side rendering', () => {

  test('First render', () => {

    hook = customRenderHook(() => useHydrationState())

    expect(hook.getMetadata().renderCount).toBe(2)
    expect(hook.result.current).toBeTrue()

    hook.forceUpdate()
    expect(hook.result.current).toBeTrue()

  })

})
