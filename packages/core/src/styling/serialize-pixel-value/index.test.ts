import { serializePixelValue } from '.'

test('Non-pixel numeric value', () => {
  expect(serializePixelValue('opacity', 1)).toBe('1')
})

test('Pixel numeric value', () => {
  expect(serializePixelValue('font-size', 14)).toBe('14px')
})

test('String value', () => {
  expect(serializePixelValue('font-size', '14pt')).toBe('14pt')
})
