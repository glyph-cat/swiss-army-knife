import {
  ignoreWhenCompilingStyles,
  selectorPatternsToIgnore,
  selectorsToIgnore,
  tryValidateCSSSelector,
} from '.'

beforeEach(() => {
  selectorPatternsToIgnore.current = []
  selectorsToIgnore.current = new Set<string>()
})

afterEach(() => {
  // This ensures that an error is thrown if the values are changed after the test is done
  // which indicates a test pollution.
  selectorPatternsToIgnore.current = null!
  selectorsToIgnore.current = null!
})

test('Empty string', () => {
  expect(tryValidateCSSSelector('')).toBe(false)
})

test('Class name', () => {
  expect(tryValidateCSSSelector('.foo')).toBe(true)
})

test('ID', () => {
  expect(tryValidateCSSSelector('#foo')).toBe(true)
})

test('Valid HTML element', () => {
  expect(tryValidateCSSSelector('div')).toBe(true)
})

test('Custom web component (registered)', () => {
  ignoreWhenCompilingStyles('foo')
  expect(tryValidateCSSSelector('foo')).toBe(true)
})

test('Custom web component (unregistered)', () => {
  expect(tryValidateCSSSelector('foo')).toBe(false)
})
