import { isNumberOrNaN } from '.'

test(isNumberOrNaN.name, () => {
  expect(isNumberOrNaN(NaN)).toBeTrue()
  expect(isNumberOrNaN(42)).toBeTrue()
  expect(isNumberOrNaN('42')).toBeFalse()
  expect(isNumberOrNaN(null)).toBeFalse()
  expect(isNumberOrNaN(undefined)).toBeFalse()
})
