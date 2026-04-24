import { getNthTriangularNumber } from '.'

test('With last number only', () => {
  expect(getNthTriangularNumber(1)).toBe(1)
  expect(getNthTriangularNumber(2)).toBe(1 + 2)
  expect(getNthTriangularNumber(3)).toBe(1 + 2 + 3)
  expect(getNthTriangularNumber(4)).toBe(1 + 2 + 3 + 4)
  expect(getNthTriangularNumber(5)).toBe(1 + 2 + 3 + 4 + 5)
})

test('With first & last numbers', () => {
  expect(getNthTriangularNumber(3, 7)).toBe(3 + 4 + 5 + 6 + 7)
  expect(getNthTriangularNumber(-2, 2)).toBe(-2 + -1 + 0 + 1 + 2)
  expect(getNthTriangularNumber(-7, -3)).toBe(-7 + -6 + -5 + -4 + -3)
})
