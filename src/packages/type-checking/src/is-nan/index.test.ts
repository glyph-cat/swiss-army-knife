import { isNaN } from '.'

test(isNaN.name, () => {
  expect(isNaN(NaN)).toBe(true)
  expect(isNaN(42)).toBe(false)
  expect(isNaN('42')).toBe(false)
  expect(isNaN(null)).toBe(false)
  expect(isNaN(undefined)).toBe(false)
})
