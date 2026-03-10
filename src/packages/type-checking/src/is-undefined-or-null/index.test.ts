import { isUndefinedOrNull } from '.'

test(isUndefinedOrNull.name, () => {
  expect(isUndefinedOrNull(undefined)).toBeTrue()
  expect(isUndefinedOrNull(null)).toBeTrue()
  expect(isUndefinedOrNull(false)).toBeFalse()
  expect(isUndefinedOrNull({})).toBeFalse()
})
