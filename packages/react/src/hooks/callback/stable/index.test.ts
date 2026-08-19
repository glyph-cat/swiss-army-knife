import { customRenderHook, CustomRenderHookResult } from '@glyph-cat/react-test-utils'
import { pickLast } from '@glyph-cat/swiss-army-knife'
import { act, useCallback } from 'react'
import { useStableCallback } from '.'

interface HookReturnType {
  stableCallback(): void
  normalCallback(): void
}

let hook: CustomRenderHookResult<HookReturnType, void>
afterEach(() => { hook?.unmount() })

test(useStableCallback.name, () => {

  const normalSpyFn = jest.fn()
  const stableSpyFn = jest.fn()

  // #region Random number generator

  const randomNumberHistory: Array<number> = []

  function getRandomNumber(): number {
    const newValue = Math.random()
    randomNumberHistory.push(newValue)
    return newValue
  }

  function getLastGeneratedNumber(): number {
    return pickLast(randomNumberHistory)
  }

  // #endregion Random number generator

  hook = customRenderHook(() => {
    const unstableValue = getRandomNumber()
    const normalCallback = useCallback(() => { normalSpyFn(unstableValue) }, [unstableValue])
    const stableCallback = useStableCallback(() => { stableSpyFn(unstableValue) })
    return { stableCallback, normalCallback }
  })

  // MARK: First render

  const normalCallbackSnapshot = hook.result.current.normalCallback
  const stableCallbackSnapshot = hook.result.current.stableCallback
  const generatedNumberInFirstRender = getLastGeneratedNumber()

  act(() => { normalCallbackSnapshot() })
  expect(normalSpyFn).toHaveBeenCalledTimes(1)
  expect(normalSpyFn).toHaveBeenNthCalledWith(1, generatedNumberInFirstRender)

  act(() => { stableCallbackSnapshot() })
  expect(stableSpyFn).toHaveBeenCalledTimes(1)
  expect(stableSpyFn).toHaveBeenNthCalledWith(1, generatedNumberInFirstRender)

  hook.forceUpdate()

  // MARK: Second render

  const generatedNumberInSecondRender = getLastGeneratedNumber()

  expect(Object.is(hook.result.current.normalCallback, normalCallbackSnapshot)).toBeFalse()
  expect(Object.is(hook.result.current.stableCallback, stableCallbackSnapshot)).toBeTrue()

  act(() => { normalCallbackSnapshot() })
  expect(normalSpyFn).toHaveBeenCalledTimes(2)
  expect(normalSpyFn).toHaveBeenNthCalledWith(2, generatedNumberInFirstRender)

  act(() => { stableCallbackSnapshot() })
  expect(stableSpyFn).toHaveBeenCalledTimes(2)
  expect(stableSpyFn).toHaveBeenNthCalledWith(2, generatedNumberInSecondRender)

})
