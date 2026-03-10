import { isNullOrUndefined } from '.'

test(isNullOrUndefined.name, () => {
  expect(isNullOrUndefined(undefined)).toBeTrue()
  expect(isNullOrUndefined(null)).toBeTrue()
  expect(isNullOrUndefined(false)).toBeFalse()
  expect(isNullOrUndefined({})).toBeFalse()
})
