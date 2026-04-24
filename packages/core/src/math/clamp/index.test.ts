import { clamp, isClamped } from '.'

test(clamp.name, (): void => {
  expect(clamp(5, 0, 10)).toBe(5)
  expect(clamp(-5, 0, 10)).toBe(0)
  expect(clamp(15, 0, 10)).toBe(10)
})

test(isClamped.name, (): void => {
  expect(isClamped(5, 0, 10)).toBeTrue()
  expect(isClamped(0, 0, 10)).toBeTrue()
  expect(isClamped(-5, 0, 10)).toBeFalse()
  expect(isClamped(10, 0, 10)).toBeTrue()
  expect(isClamped(15, 0, 10)).toBeFalse()
})
