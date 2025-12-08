import { Value2D } from '@glyph-cat/foundation'

/**
 * Gets the distance between two 2D points.
 * @param x1 - X value of the first point.
 * @param y1 - Y value of the first point.
 * @param x2 - X value of the second point.
 * @param y2 - Y value of the second point.
 * @returns The distance between the two points.
 * @public
 */
export function getDistance2D(
  x1: number,
  y1: number,
  x2: number,
  y2: number,
): number {
  return Math.hypot(x2 - x1, y2 - y1)
}

/**
 * Gets the distance between two 2D points.
 * @param a - The first point.
 * @param b - The second point.
 * @returns The distance between the two points.
 * @public
 */
export function getDistance2DByCoordinates(a: Value2D, b: Value2D): number {
  return getDistance2D(a.x, a.y, b.x, b.y)
}

/**
 * Calculates the angle from two vectors.
 * @param a - The first vector.
 * @param b - The second vector.
 * @returns Angle of the two vectors in radians.
 * @see https://stackoverflow.com/a/42159152/5810737
 * @public
 */
export function getAngleOfVectorsIn2D(a: Value2D, b: Value2D): number {
  return Math.atan2(a.x * b.y - a.y * b.x, a.x * b.x + a.y * b.y)
}

/**
 * Calculates the angle from two vectors based on their points.
 * @param a1 - First point of the first vector.
 * @param a2 - Second point of the first vector.
 * @param b1 - First point of the second vector.
 * @param b2 - Second point of the second vector.
 * @returns Angle of the two vectors in radians.
 * @public
 */
export function getAngleFromPointsIn2D(
  a1: Value2D,
  a2: Value2D,
  b1: Value2D,
  b2: Value2D,
): number {
  const vectorA: Value2D = {
    x: a2.x - a1.x,
    y: a2.y - a1.y,
  }
  const vectorB: Value2D = {
    x: b2.x - b1.x,
    y: b2.y - b1.y,
  }
  return getAngleOfVectorsIn2D(vectorA, vectorB)
}
