import { customRenderHook, CustomRenderHookResult } from '@glyph-cat/react-test-utils'
import { useMemoAlt } from '.'

type ITestObject = { a: number, b: number, c: number }

let hook: CustomRenderHookResult<ITestObject, ITestObject>
afterEach(() => { hook?.unmount() })

test('Dependencies are same', () => {

  const spyFn = jest.fn()
  hook = customRenderHook((props) => useMemoAlt(() => props, [props]), {
    initialProps: { a: 1, b: 2, c: 3 },
  })

  const snapshot1 = hook.result.current
  expect(snapshot1).toStrictEqual({ a: 1, b: 2, c: 3 })
  expect(spyFn).toHaveBeenCalledTimes(1)

  hook.rerender({ a: 1, b: 2, c: 3 })
  const snapshot2 = hook.result.current
  expect(snapshot2).toStrictEqual({ a: 1, b: 2, c: 3 })
  expect(Object.is(snapshot1, snapshot2)).toBeTrue()
  expect(spyFn).toHaveBeenCalledTimes(1)

})

test('Dependencies are different', () => {

  const spyFn = jest.fn()
  hook = customRenderHook((props) => useMemoAlt(() => props, [props]), {
    initialProps: { a: 1, b: 2, c: 3 },
  })

  const snapshot1 = hook.result.current
  expect(snapshot1).toStrictEqual({ a: 1, b: 2, c: 3 })
  expect(spyFn).toHaveBeenCalledTimes(1)

  hook.rerender({ a: 1, b: 2, c: 7 })
  const snapshot2 = hook.result.current
  expect(snapshot2).toStrictEqual({ a: 1, b: 2, c: 7 })
  expect(Object.is(snapshot1, snapshot2)).toBeFalse()
  expect(spyFn).toHaveBeenCalledTimes(2)

})
