import { isNullOrEmpty } from '.'

describe(isNullOrEmpty.name, () => {

  test('When is null', () => {
    expect(isNullOrEmpty(null)).toBeTrue()
  })

  test('When is empty string', () => {
    expect(isNullOrEmpty('')).toBeTrue()
  })

  test('When is whitespace', () => {
    expect(isNullOrEmpty(' ')).toBeFalse()
  })

  test('When has content', () => {
    expect(isNullOrEmpty('abc')).toBeFalse()
  })

})
