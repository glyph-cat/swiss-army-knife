import {
  isCaseInsensitiveEqual,
  isLocaleCaseInsensitiveEqual,
} from '.'

describe(isCaseInsensitiveEqual.name, () => {

  test('Equal', () => {
    expect(isCaseInsensitiveEqual('Foo', 'foo')).toBe(true)
  })

  test('Not equal', () => {
    expect(isCaseInsensitiveEqual('Foo', 'bar')).toBe(false)
  })

  test('Invalid types', () => {
    expect(isCaseInsensitiveEqual('Foo', null)).toBe(false)
    expect(isCaseInsensitiveEqual('Foo', undefined)).toBe(false)
    expect(isCaseInsensitiveEqual('Foo', 42)).toBe(false)
  })

})

describe(isLocaleCaseInsensitiveEqual.name, () => {

  // Reference: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/toLocaleLowerCase

  test('Equal', () => {
    expect(isLocaleCaseInsensitiveEqual('İstanbul', 'istanbul', 'tr')).toBe(true)
  })

  test('Not equal', () => {
    expect(isLocaleCaseInsensitiveEqual('İstanbul', 'Istanbul', 'tr')).toBe(false)
  })

  test('Invalid types', () => {
    expect(isLocaleCaseInsensitiveEqual('Foo', null)).toBe(false)
    expect(isLocaleCaseInsensitiveEqual('Foo', undefined)).toBe(false)
    expect(isLocaleCaseInsensitiveEqual('Foo', 42)).toBe(false)
  })

})
