import { CleanupManager } from '@glyph-cat/cleanup-manager'
import { HookTester } from '@glyph-cat/react-test-utils'
import { pickLast } from '@glyph-cat/swiss-army-knife'
import { useCallback } from 'react'
import { useStableCallback } from '.'

let cleanupManager: CleanupManager
beforeEach(() => { cleanupManager = new CleanupManager() })
afterEach(() => { cleanupManager.run() })

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

  const tester = new HookTester({
    useHook: () => {
      const unstableValue = getRandomNumber()
      const normalCallback = useCallback(() => { normalSpyFn(unstableValue) }, [unstableValue])
      const stableCallback = useStableCallback(() => { stableSpyFn(unstableValue) })
      return { stableCallback, normalCallback }
    },
    get: {
      normalCallback: ({ normalCallback }) => normalCallback,
      stableCallback: ({ stableCallback }) => stableCallback,
    },
  }, cleanupManager)

  // #region First render

  const normalCallbackSnapshot = tester.get('normalCallback')
  const stableCallbackSnapshot = tester.get('stableCallback')
  const generatedNumberInFirstRender = getLastGeneratedNumber()

  normalCallbackSnapshot()
  expect(normalSpyFn).toHaveBeenCalledTimes(1)
  expect(normalSpyFn).toHaveBeenNthCalledWith(1, generatedNumberInFirstRender)

  stableCallbackSnapshot()
  expect(stableSpyFn).toHaveBeenCalledTimes(1)
  expect(stableSpyFn).toHaveBeenNthCalledWith(1, generatedNumberInFirstRender)

  // #endregion First render

  tester.forceUpdate()

  // #region Second render

  const generatedNumberInSecondRender = getLastGeneratedNumber()

  expect(Object.is(tester.get('normalCallback'), normalCallbackSnapshot)).toBe(false)
  expect(Object.is(tester.get('stableCallback'), stableCallbackSnapshot)).toBe(true)

  normalCallbackSnapshot()
  expect(normalSpyFn).toHaveBeenCalledTimes(2)
  expect(normalSpyFn).toHaveBeenNthCalledWith(2, generatedNumberInFirstRender)

  stableCallbackSnapshot()
  expect(stableSpyFn).toHaveBeenCalledTimes(2)
  expect(stableSpyFn).toHaveBeenNthCalledWith(2, generatedNumberInSecondRender)

  // #endregion Second render

})
