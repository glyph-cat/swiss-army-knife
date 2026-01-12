import { isNumberOrNaN } from '.'

test(isNumberOrNaN.name, () => {
  expect(isNumberOrNaN(NaN)).toBe(true)
  expect(isNumberOrNaN(42)).toBe(true)
  expect(isNumberOrNaN('42')).toBe(false)
  expect(isNumberOrNaN(null)).toBe(false)
  expect(isNumberOrNaN(undefined)).toBe(false)
})
