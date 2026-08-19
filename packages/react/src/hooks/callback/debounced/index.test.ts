import { customRenderHook, CustomRenderHookResult } from '@glyph-cat/react-test-utils'
import { act } from '@testing-library/react'
import { useDebouncedCallback } from '.'

let hook: CustomRenderHookResult<ReturnType<typeof useDebouncedCallback>, void>
afterEach(() => { hook?.unmount() })

test('Invocations overlap', () => {
  const spyFn = jest.fn()
  hook = customRenderHook(() => useDebouncedCallback(spyFn, 100))
  const debouncedCallback = hook.result.current
  act(() => {
    debouncedCallback()
    debouncedCallback()
  })
  jest.advanceTimersByTime(100)
  expect(spyFn).toHaveBeenCalledTimes(1)
})

test('Invocations do not overlap', () => {
  const spyFn = jest.fn()
  hook = customRenderHook(() => useDebouncedCallback(spyFn, 100))
  const debouncedCallback = hook.result.current
  act(() => { debouncedCallback() })
  jest.advanceTimersByTime(150)
  act(() => { debouncedCallback() })
  jest.advanceTimersByTime(100)
  expect(spyFn).toHaveBeenCalledTimes(2)
})
