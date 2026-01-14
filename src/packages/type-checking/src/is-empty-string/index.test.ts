import { isEmptyString } from '.'

describe(isEmptyString.name, () => {

  test('When is null', () => {
    expect(isEmptyString(null)).toBe(false)
  })

  test('When is empty string', () => {
    expect(isEmptyString('')).toBe(true)
  })

  test('When is whitespace', () => {
    expect(isEmptyString(' ')).toBe(false)
  })

  test('When has content', () => {
    expect(isEmptyString('abc')).toBe(false)
  })

})
