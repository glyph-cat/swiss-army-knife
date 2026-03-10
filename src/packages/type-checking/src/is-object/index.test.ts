import { isObject } from '.'

test(isObject.name, () => {
  expect(isObject({})).toBeTrue()
  expect(isObject([])).toBeTrue()
  expect(isObject(null)).toBeFalse()
  expect(isObject(function () { /* ... */ })).toBeFalse()
  expect(isObject('')).toBeFalse()
  expect(isObject(false)).toBeFalse()
  expect(isObject(undefined)).toBeFalse()
})
