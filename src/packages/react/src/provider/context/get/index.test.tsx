import { getContext } from './index'

test('isMounted = true', () => {
  const context = getContext(true)
  expect(context.M$isHydrated).toBe(true)
  expect(context.M$initializerStore).toStrictEqual({})
})

test('isMounted = false', () => {
  const context = getContext(false)
  expect(context.M$isHydrated).toBe(false)
  expect(context.M$initializerStore).toStrictEqual({})
})
