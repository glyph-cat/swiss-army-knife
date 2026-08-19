import { customRenderHook, CustomRenderHookResult } from '@glyph-cat/react-test-utils'
import { act } from 'react'
import { useStateAlt } from '.'

const useTestHook = () => useStateAlt(0)

let hook: CustomRenderHookResult<ReturnType<typeof useTestHook>, void>
afterEach(() => { hook?.unmount() })

test(useStateAlt.name, () => {

  hook = customRenderHook(useTestHook)
  expect(hook.result.current[0]).toBe(0)

  act(() => { hook.result.current[1]((c) => c + 1) })
  expect(hook.result.current[0]).toBe(1)
  act(() => { hook.result.current[1]((c) => c + 1) })
  expect(hook.result.current[0]).toBe(2)

  act(() => { hook.result.current[2]() })
  expect(hook.result.current[0]).toBe(0)

})
