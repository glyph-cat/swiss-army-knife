import { isNull } from '.'

test(isNull.name, () => {
  expect(isNull(null)).toBeTrue()
  expect(isNull(undefined)).toBeFalse()
  expect(isNull(false)).toBeFalse()
  expect(isNull({})).toBeFalse()
})
