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

test(LinearEquation2D.fromPoints.name, () => {
  const equation = LinearEquation2D.fromPoints({ x: 2, y: 6 }, { x: 4, y: 9 })
  expect(equation.m).toBe(1.5)
  expect(equation.c).toBe(3)
})

test(LinearEquation2D.calcFromPointAndGradient.name, () => {
  expect(LinearEquation2D.calcFromPointAndGradient({ x: 2, y: 6 }, 1.5, 3)).toBe(7.5)
})

test(LinearEquation2D.calcFromPoints.name, () => {
  expect(LinearEquation2D.calcFromPoints({ x: 2, y: 6 }, { x: 4, y: 9 }, 6)).toBe(12)
})
