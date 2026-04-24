import { isUndefined } from '.'

test(isUndefined.name, () => {
  expect(isUndefined(undefined)).toBeTrue()
  expect(isUndefined(null)).toBeFalse()
  expect(isUndefined(false)).toBeFalse()
  expect(isUndefined({})).toBeFalse()
})
