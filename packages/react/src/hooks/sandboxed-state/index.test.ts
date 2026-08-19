import { customRenderHook, CustomRenderHookResult } from '@glyph-cat/react-test-utils'
import { act } from 'react'
import { useSandboxedState } from '.'

let hook: CustomRenderHookResult<ReturnType<typeof useSandboxedState<Array<number>>>, void>
afterEach(() => { hook?.unmount() })

test(useSandboxedState.name, () => {

  // Goals:
  // - Ensure mutability of state (object reference is preserved)
  // - Ensure component re-render even when new state points to old state by object reference

  const INITIAL_STATE: Array<number> = []
  const DIFFERENT_REFERENCE_SAME_VALUE: Array<number> = []
  const DIFFERENT_REFERENCE_DIFFERENT_VALUE = [2]

  hook = customRenderHook(() => useSandboxedState<Array<number>>(INITIAL_STATE))

  expect(Object.is(hook.result.current, INITIAL_STATE)).toBeTrue()

  act(() => { hook.result.current[1](INITIAL_STATE) })
  expect(Object.is(hook.result.current, INITIAL_STATE)).toBeTrue()
  expect(hook.result.current).toStrictEqual([])

  act(() => { hook.result.current[1](DIFFERENT_REFERENCE_SAME_VALUE) })
  expect(Object.is(hook.result.current, DIFFERENT_REFERENCE_SAME_VALUE)).toBeTrue()
  expect(hook.result.current).toStrictEqual([])

  act(() => { hook.result.current[1](DIFFERENT_REFERENCE_DIFFERENT_VALUE) })
  expect(Object.is(hook.result.current, DIFFERENT_REFERENCE_DIFFERENT_VALUE)).toBeTrue()
  expect(hook.result.current).toStrictEqual([2])

  act(() => {
    hook.result.current[1]((prevState) => {
      prevState.push(1)
      return prevState
    })
  })
  expect(Object.is(hook.result.current, DIFFERENT_REFERENCE_DIFFERENT_VALUE)).toBeTrue()
  expect(hook.result.current).toStrictEqual([2, 1])

})
