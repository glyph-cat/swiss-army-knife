import { normalizeCSSValue } from '.'

test('Non-pixel numeric value', () => {
  expect(normalizeCSSValue('opacity', 1)).toBe('1')
})

test('Pixel numeric value', () => {
  expect(normalizeCSSValue('font-size', 14)).toBe('14px')
  // #region Patch for 'position'
  expect(normalizeCSSValue('background-position', 10)).toBe('10px')
  expect(normalizeCSSValue('position', 'grid')).toBe('grid')
  // #endregion Patch for 'position'
})

test('String value', () => {
  expect(normalizeCSSValue('font-size', '14pt')).toBe('14pt')
})
