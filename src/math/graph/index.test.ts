import {
  createLinearEquationFromPointAndGradient,
  createLinearEquationFromTwoPoints,
  linearMapFromPointAndGradient,
  linearMapFromTwoPoints,
} from '.'

describe(createLinearEquationFromPointAndGradient.name, (): void => {

  test('All positive (y = 1.5x + 0.5)', (): void => {
    const f = createLinearEquationFromPointAndGradient(3, 5, 1.5)
    expect(f(-10)).toBe(-14.5)
    expect(f(42)).toBe(63.5)
  })

  test('Negative gradient (y = -2x + 11)', (): void => {
    const f = createLinearEquationFromPointAndGradient(3, 5, -2)
    expect(f(-10)).toBe(31)
    expect(f(42)).toBe(-73)
  })

  test('One negative point (y = 6x - 25)', (): void => {
    const f = createLinearEquationFromPointAndGradient(3, -7, 6)
    expect(f(-10)).toBe(-85)
    expect(f(42)).toBe(227)
  })

})

describe(linearMapFromPointAndGradient.name, (): void => {

  test('All positive (y = 1.5x + 0.5)', (): void => {
    expect(linearMapFromPointAndGradient(3, 5, 1.5, -10)).toBe(-14.5)
    expect(linearMapFromPointAndGradient(3, 5, 1.5, 42)).toBe(63.5)
  })

  test('Negative gradient (y = -2x + 11)', (): void => {
    expect(linearMapFromPointAndGradient(3, 5, -2, -10)).toBe(31)
    expect(linearMapFromPointAndGradient(3, 5, -2, 42)).toBe(-73)
  })

  test('One negative point (y = 6x - 25)', (): void => {
    expect(linearMapFromPointAndGradient(3, -7, 6, -10)).toBe(-85)
    expect(linearMapFromPointAndGradient(3, -7, 6, 42)).toBe(227)
  })

})

describe(createLinearEquationFromTwoPoints.name, (): void => {

  test('All points positive (y = 2/3x + 5)', (): void => {
    const f = createLinearEquationFromTwoPoints(3, 7, 6, 9)
    expect(f(-12)).toBe(-3)
    expect(f(42)).toBe(33)
  })

  test('One point negative (y = 17/5x - 3.2)', (): void => {
    const f = createLinearEquationFromTwoPoints(3, 7, -2, -10)
    expect(f(-10)).toBe(-37.2)
    expect(f(42)).toBe(139.6)
  })

  test('All points negative (y = -2x - 14)', (): void => {
    const f = createLinearEquationFromTwoPoints(-3, -8, -4, -6)
    expect(f(-10)).toBe(6)
    expect(f(42)).toBe(-98)
  })

})

describe(linearMapFromTwoPoints.name, (): void => {

  test('All points positive (y = 2/3x + 5)', (): void => {
    expect(linearMapFromTwoPoints(3, 7, 6, 9, -12)).toBe(-3)
    expect(linearMapFromTwoPoints(3, 7, 6, 9, 42)).toBe(33)
  })

  test('One point negative (y = 17/5x - 3.2)', (): void => {
    expect(linearMapFromTwoPoints(3, 7, -2, -10, -10)).toBe(-37.2)
    expect(linearMapFromTwoPoints(3, 7, -2, -10, 42)).toBe(139.6)
  })

  test('All points negative (y = -2x - 14)', (): void => {
    expect(linearMapFromTwoPoints(-3, -8, -4, -6, -10)).toBe(6)
    expect(linearMapFromTwoPoints(-3, -8, -4, -6, 42)).toBe(-98)
  })

})
