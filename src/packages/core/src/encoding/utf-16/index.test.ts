import { decodeUTF16, encodeUTF16 } from '.'

describe(encodeUTF16.name, () => {

  describe('compact flag', () => {

    test('Not provided', () => {
      expect(encodeUTF16('hello')).toBe('\\u0068\\u0065\\u006c\\u006c\\u006f')
    })

    test('false', () => {
      expect(encodeUTF16('hello')).toBe('\\u0068\\u0065\\u006c\\u006c\\u006f')
    })

    test('true', () => {
      expect(encodeUTF16('hello', true)).toBe('\\u{68}\\u{65}\\u{6c}\\u{6c}\\u{6f}')
    })

  })

  test('Empty string', () => {
    expect(encodeUTF16('')).toBe('')
  })

})

describe(decodeUTF16.name, () => {

  test('From non-compact', () => {
    expect(decodeUTF16('\\u0068\\u0065\\u006c\\u006c\\u006f')).toBe('hello')
  })

  test('From compact', () => {
    expect(decodeUTF16('\\u{68}\\u{65}\\u{6c}\\u{6c}\\u{6f}')).toBe('hello')
  })

  test('From mixed', () => {
    expect(decodeUTF16('\\u0068\\u0065\\u006c\\u{6c}\\u{6f}')).toBe('hello')
  })

  test('From empty string', () => {
    expect(decodeUTF16('')).toBe('')
  })

})
