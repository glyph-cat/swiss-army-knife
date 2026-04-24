import { getMonogramValue } from '.'

test('Empty string', () => {
  expect(getMonogramValue('')).toBe('')
})

test('Happy path (`maxLetters` falls back to default value)', () => {
  expect(getMonogramValue('Foo Bar')).toBe('FB')
})

test('Casing of letters are preserved', () => {
  expect(getMonogramValue('foo bar')).toBe('fb')
})

test('Less words than the desired number of letters', () => {
  expect(getMonogramValue('Foo', 2)).toBe('F')
})

test('Same amount of words as the desired number of letters', () => {
  expect(getMonogramValue('Foo Bar', 2)).toBe('FB')
})

test('More words than the desired number of letters', () => {
  expect(getMonogramValue('Foo Bar Baz')).toBe('FB')
})
