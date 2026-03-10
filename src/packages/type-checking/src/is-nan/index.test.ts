import { isNaN } from '.'

test(isNaN.name, () => {
  expect(isNaN(NaN)).toBeTrue()
  expect(isNaN(42)).toBeFalse()
  expect(isNaN('42')).toBeFalse()
  expect(isNaN(null)).toBeFalse()
  expect(isNaN(undefined)).toBeFalse()
})
