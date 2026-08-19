import { RefObject } from '@glyph-cat/foundation'
import { customRenderHook, CustomRenderHookResult } from '@glyph-cat/react-test-utils'
import { useLazyRef } from '.'

let hook: CustomRenderHookResult<RefObject<number>, void>
afterEach(() => { hook?.unmount() })

test(useLazyRef.name, () => {

  const factory = jest.fn(() => 42)
  hook = customRenderHook(() => useLazyRef(factory))

  expect(factory).toHaveBeenCalledTimes(1)
  expect(hook.result.current).toStrictEqual({ current: 42 })
  expect(hook.getMetadata().renderCount).toBe(1)

  hook.forceUpdate()
  expect(factory).toHaveBeenCalledTimes(1)
  expect(hook.result.current).toStrictEqual({ current: 42 })
  expect(hook.getMetadata().renderCount).toBe(2)

})
