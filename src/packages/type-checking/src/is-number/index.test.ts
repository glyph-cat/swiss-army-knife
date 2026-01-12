import { isNumber } from '.'

test(isNumber.name, () => {
  expect(isNumber(42)).toBe(true)
  expect(isNumber('42')).toBe(false)
  expect(isNumber(NaN)).toBe(false)
  expect(isNumber(null)).toBe(false)
  expect(isNumber(undefined)).toBe(false)
})
