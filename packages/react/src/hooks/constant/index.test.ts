import { customRenderHook, CustomRenderHookResult } from '@glyph-cat/react-test-utils'
import { useConstant } from '.'

let hook: CustomRenderHookResult<number, void>
afterEach(() => { hook?.unmount() })

test('Value', () => {
  hook = customRenderHook(() => useConstant(42))
  expect(hook.result.current).toBe(42)
  expect(hook.getMetadata().renderCount).toBe(1)
})

test('Factory', () => {

  const factory = jest.fn(() => 42)
  hook = customRenderHook(() => useConstant(factory))

  expect(factory).toHaveBeenCalledTimes(1)
  expect(hook.result.current).toBe(42)
  expect(hook.getMetadata().renderCount).toBe(1)

  hook.forceUpdate()
  expect(factory).toHaveBeenCalledTimes(1)
  expect(hook.result.current).toBe(42)
  expect(hook.getMetadata().renderCount).toBe(2)

})
