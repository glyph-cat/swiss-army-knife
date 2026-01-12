import { isObjectOrNull } from '.'

test(isObjectOrNull.name, () => {
  expect(isObjectOrNull({})).toBe(true)
  expect(isObjectOrNull([])).toBe(true)
  expect(isObjectOrNull(null)).toBe(true)
  expect(isObjectOrNull(function () { /* ... */ })).toBe(false)
  expect(isObjectOrNull('')).toBe(false)
  expect(isObjectOrNull(false)).toBe(false)
  expect(isObjectOrNull(undefined)).toBe(false)
})
