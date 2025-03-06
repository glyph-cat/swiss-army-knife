import { serializePixelValue } from '.'

test('String type', () => {
  expect(serializePixelValue('42')).toBe('42')
})

test('Number type', () => {
  expect(serializePixelValue(42)).toBe('42px')
})
