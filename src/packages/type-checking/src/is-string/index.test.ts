import { isString } from '.'

test(isString.name, () => {
  expect(isString('')).toBe(true)
  expect(isString(null)).toBe(false)
  expect(isString(undefined)).toBe(false)
  expect(isString(42)).toBe(false)
})
