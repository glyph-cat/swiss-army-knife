import { customRenderHook, CustomRenderHookResult } from '@glyph-cat/react-test-utils'
import { ReactNode } from 'react'
import { renderToString } from 'react-dom/server'
import { useMountedState } from '.'

let hook: CustomRenderHookResult<boolean, void>
afterEach(() => { hook?.unmount() })

test('Server-side rendering', () => {
  function TestComponent(): ReactNode {
    return <>{String(useMountedState())}</>
  }
  expect(renderToString(<TestComponent />)).toBe(String(false))
})

test('Client-side rendering', () => {

  hook = customRenderHook(() => useMountedState())

  // 1st render
  expect(hook.getMetadata().renderCount).toBe(2)
  expect(hook.result.current).toBeTrue()

  // subsequent renders
  hook.forceUpdate()
  expect(hook.result.current).toBeTrue()

})
