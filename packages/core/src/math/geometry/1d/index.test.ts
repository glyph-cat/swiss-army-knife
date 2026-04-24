import { reflect1D } from '.'

describe(reflect1D.name, () => {

  test('Positive only', () => {
    expect(reflect1D(5, 10)).toBe(15)
  })

  test('Negative only', () => {
    expect(reflect1D(-15, -10)).toBe(-5)
  })

  test('Negative <-> positive', () => {
    expect(reflect1D(-20, 10)).toBe(40)
  })

})
