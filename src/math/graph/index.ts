/**
 * Creates a linear equation based on a point and a gradient.
 * @param x1 - X coordinate of the reference point.
 * @param y1 - Y coordinate of the reference point.
 * @param m - Gradient of the equation.
 * @returns A linear equation function.
 * @example
 * const f = createLinearEquationFromPointAndGradient(3, 5, 1.5)
 * const x = 42
 * const y = f(x)
 * console.log(y) // 63.5
 * @public
 */
export function createLinearEquationFromPointAndGradient(
  x1: number,
  y1: number,
  m: number,
): (x: number) => number {
  const c = y1 - m * x1
  return (x: number): number => m * x + c
}

/**
 * Creates a linear equation from two points.
 * @param x1 - X coordinate of the first point.
 * @param y1 - Y coordinate of the first point.
 * @param x2 - X coordinate of the second point.
 * @param y2 - Y coordinate of the second point.
 * @returns A linear equation function.
 * @example
 * const f = createLinearEquationFromTwoPoints(3, 7, 5, 9)
 * const x = 42
 * const y = f(x)
 * console.log(y) // 44
 * @public
 */
export function createLinearEquationFromTwoPoints(
  x1: number,
  y1: number,
  x2: number,
  y2: number,
): (x: number) => number {
  const m = (y2 - y1) / (x2 - x1)
  const c = y1 - m * x1
  return (x: number): number => m * x + c
}
