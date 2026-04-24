import { isObjectOrNull } from '.'

test(isObjectOrNull.name, () => {
  expect(isObjectOrNull({})).toBeTrue()
  expect(isObjectOrNull([])).toBeTrue()
  expect(isObjectOrNull(null)).toBeTrue()
  expect(isObjectOrNull(function () { /* ... */ })).toBeFalse()
  expect(isObjectOrNull('')).toBeFalse()
  expect(isObjectOrNull(false)).toBeFalse()
  expect(isObjectOrNull(undefined)).toBeFalse()
})
