import { getDoubleDigitHex } from '.'

test('Happy path', () => {
  expect(getDoubleDigitHex(9)).toBe('09')
  expect(getDoubleDigitHex(255)).toBe('ff')
})
