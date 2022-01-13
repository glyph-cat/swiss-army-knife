import { clamp, withMaximumLimit, withMinimumLimit } from '.'

test(clamp.name, (): void => {
  expect(clamp(5, 0, 10)).toBe(5)
  expect(clamp(-5, 0, 10)).toBe(0)
  expect(clamp(15, 0, 10)).toBe(10)
})

test(withMaximumLimit.name, (): void => {
  expect(withMaximumLimit(7, 5)).toBe(5)
  expect(withMaximumLimit(7, 10)).toBe(7)
})

test(withMinimumLimit.name, (): void => {
  expect(withMinimumLimit(7, 5)).toBe(7)
  expect(withMinimumLimit(7, 10)).toBe(10)
})
