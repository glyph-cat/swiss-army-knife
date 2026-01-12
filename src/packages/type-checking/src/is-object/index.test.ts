import { isObject } from '.'

test(isObject.name, () => {
  expect(isObject({})).toBe(true)
  expect(isObject([])).toBe(true)
  expect(isObject(null)).toBe(false)
  expect(isObject(function () { /* ... */ })).toBe(false)
  expect(isObject('')).toBe(false)
  expect(isObject(false)).toBe(false)
  expect(isObject(undefined)).toBe(false)
})
