import { isNullOrWhitespace } from '.'

describe(isNullOrWhitespace.name, () => {

  test('When is null', () => {
    expect(isNullOrWhitespace(null)).toBe(true)
  })

  test('When is empty string', () => {
    expect(isNullOrWhitespace('')).toBe(true)
  })

  test('When is whitespace', () => {
    expect(isNullOrWhitespace(' ')).toBe(true)
  })

  test('When has content', () => {
    expect(isNullOrWhitespace('abc')).toBe(false)
  })

})
