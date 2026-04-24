import { isNumber } from '.'

test(isNumber.name, () => {
  expect(isNumber(42)).toBeTrue()
  expect(isNumber('42')).toBeFalse()
  expect(isNumber(NaN)).toBeFalse()
  expect(isNumber(null)).toBeFalse()
  expect(isNumber(undefined)).toBeFalse()
})
