import { isNullOrEmpty } from '.'

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
