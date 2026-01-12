import { isUndefinedOrNull } from '.'

test(isUndefinedOrNull.name, () => {
  expect(isUndefinedOrNull(undefined)).toBe(true)
  expect(isUndefinedOrNull(null)).toBe(true)
  expect(isUndefinedOrNull(false)).toBe(false)
  expect(isUndefinedOrNull({})).toBe(false)
})
