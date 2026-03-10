import { isString } from '.'

test(isString.name, () => {
  expect(isString('')).toBeTrue()
  expect(isString(null)).toBeFalse()
  expect(isString(undefined)).toBeFalse()
  expect(isString(42)).toBeFalse()
})
