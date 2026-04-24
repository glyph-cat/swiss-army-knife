import {
  isCaseInsensitiveEqual,
  isLocaleCaseInsensitiveEqual,
} from '.'

describe(isCaseInsensitiveEqual.name, () => {

  test('Equal', () => {
    expect(isCaseInsensitiveEqual('Foo', 'foo')).toBeTrue()
  })

  test('Not equal', () => {
    expect(isCaseInsensitiveEqual('Foo', 'bar')).toBeFalse()
  })

  test('Invalid types', () => {
    expect(isCaseInsensitiveEqual('Foo', null)).toBeFalse()
    expect(isCaseInsensitiveEqual('Foo', undefined)).toBeFalse()
    expect(isCaseInsensitiveEqual('Foo', 42)).toBeFalse()
  })

})

describe(isLocaleCaseInsensitiveEqual.name, () => {

  // Reference: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/toLocaleLowerCase

  test('Equal', () => {
    expect(isLocaleCaseInsensitiveEqual('İstanbul', 'istanbul', 'tr')).toBeTrue()
  })

  test('Not equal', () => {
    expect(isLocaleCaseInsensitiveEqual('İstanbul', 'Istanbul', 'tr')).toBeFalse()
  })

  test('Invalid types', () => {
    expect(isLocaleCaseInsensitiveEqual('Foo', null)).toBeFalse()
    expect(isLocaleCaseInsensitiveEqual('Foo', undefined)).toBeFalse()
    expect(isLocaleCaseInsensitiveEqual('Foo', 42)).toBeFalse()
  })

})
