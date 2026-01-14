import { tryFormatAsClassName } from '.'

test('Classname', () => {
  expect(tryFormatAsClassName('foo')).toBe('.foo')
})

test('ID', () => {
  expect(tryFormatAsClassName('#foo')).toBe('#foo')
})

test('Selector (Example: ":root")', () => {
  expect(tryFormatAsClassName(':root')).toBe(':root')
})
