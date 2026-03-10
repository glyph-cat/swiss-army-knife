import { isEmptyString } from '.'

describe(isEmptyString.name, () => {

  test('When is null', () => {
    expect(isEmptyString(null)).toBeFalse()
  })

  test('When is empty string', () => {
    expect(isEmptyString('')).toBeTrue()
  })

  test('When is whitespace', () => {
    expect(isEmptyString(' ')).toBeFalse()
  })

  test('When has content', () => {
    expect(isEmptyString('abc')).toBeFalse()
  })

})
