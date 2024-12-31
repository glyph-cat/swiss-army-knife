import { isNullOrEmpty, isNullOrWhitespace } from '.'

describe(isNullOrEmpty.name, () => {

  test('When is null', () => {
    expect(isNullOrEmpty(null)).toBe(true)
  })

  test('When is empty string', () => {
    expect(isNullOrEmpty('')).toBe(true)
  })

  test('When is whitespace', () => {
    expect(isNullOrEmpty(' ')).toBe(false)
  })

  test('When has content', () => {
    expect(isNullOrEmpty('abc')).toBe(false)
  })

})

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
