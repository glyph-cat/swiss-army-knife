import { getLuminance } from '.'

test('Happy path', () => {
  expect(getLuminance(0, 0, 0)).toBe(0)
  expect(getLuminance(1, 1, 1)).toBe(1)
  expect(Math.round(getLuminance(255, 255, 255))).toBe(255) // 254.99999999999997
})
