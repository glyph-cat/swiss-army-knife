import { isUndefined } from '.'

test(isUndefined.name, () => {
  expect(isUndefined(undefined)).toBe(true)
  expect(isUndefined(null)).toBe(false)
  expect(isUndefined(false)).toBe(false)
  expect(isUndefined({})).toBe(false)
})
