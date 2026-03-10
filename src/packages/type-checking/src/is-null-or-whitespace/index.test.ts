import { isNullOrWhitespace } from '.'

describe(isNullOrWhitespace.name, () => {

  test('When is null', () => {
    expect(isNullOrWhitespace(null)).toBeTrue()
  })

  test('When is empty string', () => {
    expect(isNullOrWhitespace('')).toBeTrue()
  })

  test('When is whitespace', () => {
    expect(isNullOrWhitespace(' ')).toBeTrue()
  })

  test('When has content', () => {
    expect(isNullOrWhitespace('abc')).toBeFalse()
  })

})
