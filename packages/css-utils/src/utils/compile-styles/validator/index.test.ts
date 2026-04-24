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
  expect(tryValidateCSSSelector('')).toBeFalse()
})

test('Class name', () => {
  expect(tryValidateCSSSelector('.foo')).toBeTrue()
})

test('ID', () => {
  expect(tryValidateCSSSelector('#foo')).toBeTrue()
})

test('Valid HTML element', () => {
  expect(tryValidateCSSSelector('div')).toBeTrue()
})

test('Custom web component (registered)', () => {
  ignoreWhenCompilingStyles('foo')
  expect(tryValidateCSSSelector('foo')).toBeTrue()
})

test('Custom web component (unregistered)', () => {
  expect(tryValidateCSSSelector('foo')).toBeFalse()
})
