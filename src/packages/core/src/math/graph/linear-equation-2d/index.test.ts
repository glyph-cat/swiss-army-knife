import { LinearEquation2D } from '.'

test('Main', () => {
  const m = 1.5
  const c = 3
  const equation = new LinearEquation2D(m, c)
  expect(equation.m).toBe(m)
  expect(equation.c).toBe(c)
  const x = 2
  expect(equation.calc(x)).toBe(6)
  expect(equation.ƒ(x)).toBe(6)
})

test(LinearEquation2D.fromPointAndGradient.name, () => {
  const x = 2
  const y = 6
  const m = 1.5
  const equation = LinearEquation2D.fromPointAndGradient({ x, y }, m)
  expect(equation.m).toBe(m)
  expect(equation.c).toBe(3)
})

// test(LinearEquation2D.fromPoints.name, () => {
//   //
// })

// test(LinearEquation2D.calcFromPointAndGradient.name, () => {
//   //
// })

// test(LinearEquation2D.calcFromPoints.name, () => {
//   //
// })

// =============================================================================

// describe(createLinearEquationFromPointAndGradient.name, (): void => {

//   test('All positive (y = 1.5x + 0.5)', (): void => {
//     const f = createLinearEquationFromPointAndGradient(3, 5, 1.5)
//     expect(f(-10)).toBe(-14.5)
//     expect(f(42)).toBe(63.5)
//   })

//   test('Negative gradient (y = -2x + 11)', (): void => {
//     const f = createLinearEquationFromPointAndGradient(3, 5, -2)
//     expect(f(-10)).toBe(31)
//     expect(f(42)).toBe(-73)
//   })

//   test('One negative point (y = 6x - 25)', (): void => {
//     const f = createLinearEquationFromPointAndGradient(3, -7, 6)
//     expect(f(-10)).toBe(-85)
//     expect(f(42)).toBe(227)
//   })

// })

// describe(linearMapFromPointAndGradient.name, (): void => {

//   test('All positive (y = 1.5x + 0.5)', (): void => {
//     expect(linearMapFromPointAndGradient(3, 5, 1.5, -10)).toBe(-14.5)
//     expect(linearMapFromPointAndGradient(3, 5, 1.5, 42)).toBe(63.5)
//   })

//   test('Negative gradient (y = -2x + 11)', (): void => {
//     expect(linearMapFromPointAndGradient(3, 5, -2, -10)).toBe(31)
//     expect(linearMapFromPointAndGradient(3, 5, -2, 42)).toBe(-73)
//   })

//   test('One negative point (y = 6x - 25)', (): void => {
//     expect(linearMapFromPointAndGradient(3, -7, 6, -10)).toBe(-85)
//     expect(linearMapFromPointAndGradient(3, -7, 6, 42)).toBe(227)
//   })

// })

// describe(createLinearEquationFromTwoPoints.name, (): void => {

//   test('All points positive (y = 2/3x + 5)', (): void => {
//     const f = createLinearEquationFromTwoPoints(3, 7, 6, 9)
//     expect(f(-12)).toBe(-3)
//     expect(f(42)).toBe(33)
//   })

//   test('One point negative (y = 17/5x - 3.2)', (): void => {
//     const f = createLinearEquationFromTwoPoints(3, 7, -2, -10)
//     expect(f(-10)).toBe(-37.2)
//     expect(f(42)).toBe(139.6)
//   })

//   test('All points negative (y = -2x - 14)', (): void => {
//     const f = createLinearEquationFromTwoPoints(-3, -8, -4, -6)
//     expect(f(-10)).toBe(6)
//     expect(f(42)).toBe(-98)
//   })

// })

// describe(linearMapFromTwoPoints.name, (): void => {

//   test('All points positive (y = 2/3x + 5)', (): void => {
//     expect(linearMapFromTwoPoints(3, 7, 6, 9, -12)).toBe(-3)
//     expect(linearMapFromTwoPoints(3, 7, 6, 9, 42)).toBe(33)
//   })

//   test('One point negative (y = 17/5x - 3.2)', (): void => {
//     expect(linearMapFromTwoPoints(3, 7, -2, -10, -10)).toBe(-37.2)
//     expect(linearMapFromTwoPoints(3, 7, -2, -10, 42)).toBe(139.6)
//   })

//   test('All points negative (y = -2x - 14)', (): void => {
//     expect(linearMapFromTwoPoints(-3, -8, -4, -6, -10)).toBe(6)
//     expect(linearMapFromTwoPoints(-3, -8, -4, -6, 42)).toBe(-98)
//   })

// })
