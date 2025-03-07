import { normalizeCSSValue } from '.'

test('Non-pixel numeric value', () => {
  expect(normalizeCSSValue('opacity', 1)).toBe('1')
})

test('Pixel numeric value', () => {
  expect(normalizeCSSValue('font-size', 14)).toBe('14px')
})

test('String value', () => {
  expect(normalizeCSSValue('font-size', '14pt')).toBe('14pt')
})
