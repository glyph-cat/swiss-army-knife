import { isNullOrUndefined } from '.'

test(isNullOrUndefined.name, () => {
  expect(isNullOrUndefined(undefined)).toBe(true)
  expect(isNullOrUndefined(null)).toBe(true)
  expect(isNullOrUndefined(false)).toBe(false)
  expect(isNullOrUndefined({})).toBe(false)
})
