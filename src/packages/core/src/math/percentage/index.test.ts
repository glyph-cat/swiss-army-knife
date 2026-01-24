import { getPercentage } from '.'

test('Control test', () => {
  expect(getPercentage(0, 0, 100)).toBe(0)
  expect(getPercentage(50, 0, 100)).toBe(0.5)
  expect(getPercentage(100, 0, 100)).toBe(1)
})

test('Negative and mixed ranges', () => {
  expect(getPercentage(0, -100, 100)).toBe(0.5)
  expect(getPercentage(-50, -100, 0)).toBe(0.5)
})
