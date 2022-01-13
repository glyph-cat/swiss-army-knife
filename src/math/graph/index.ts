import { isNumber } from '../../data/type-check'

/**
 * Creates a linear equation based on a points and a gradient.
 * @param x1 - X coordinate of the reference point.
 * @param y1 - Y coordinate of the reference point.
 * @param m - Gradient of the equation.
 * @returns A linear equation function.
 * @example
 * const f = createLinearEquation(3, 5, 1.5)
 * const x = 42
 * const y = f(x)
 * console.log(y) // 63.5
 * @public
 */
export function createLinearEquation(
  x1: number,
  x2: number,
  m: number
): (x: number) => number

/**
 * Creates a linear equation based on two points.
 * @param x1 - X coordinate of the first point.
 * @param y1 - Y coordinate of the first point.
 * @param x2 - X coordinate of the second point.
 * @param y2 - Y coordinate of the second point.
 * @returns A linear equation function.
 * @example
 * const f = createLinearEquation(3, 5, 7, 9)
 * const x = 42
 * const y = f(x)
 * console.log(y) // 44
 * @public
 */
export function createLinearEquation(
  x1: number,
  x2: number,
  y1: number,
  y2: number
): (x: number) => number

/**
 * @public
 */
export function createLinearEquation(
  x1: number,
  y1: number,
  x2_or_m: number,
  y2?: number
): (x: number) => number {
  const m = isNumber(y2) ? (x2_or_m - x1) / (y2 - y1) : x2_or_m
  const c = y1 - m * x1
  return (x: number): number => m * x + c
}
