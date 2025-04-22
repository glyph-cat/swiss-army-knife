import { Value2D, Value3D } from '../abstractions'

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
 * Gets the distance between two 3D points.
 * @param x1 - X value of the first point.
 * @param y1 - Y value of the first point.
 * @param z1 - Z value of the first point.
 * @param x2 - X value of the second point.
 * @param y2 - Y value of the second point.
 * @param z2 - Z value of the second point.
 * @returns The distance between the two points.
 * @public
 */
export function getDistance3D(
  x1: number,
  y1: number,
  z1: number,
  x2: number,
  y2: number,
  z2: number,
): number {
  return Math.sqrt(
    Math.pow(x2 - x1, 2) +
    Math.pow(y2 - y1, 2) +
    Math.pow(z2 - z1, 2)
  )
}

/**
 * Gets the distance between two 3D points.
 * @param a - The first point.
 * @param b - The second point.
 * @returns The distance between the two points.
 * @public
 */
export function getDistance3DByCoordinate(a: Value3D, b: Value3D): number {
  return getDistance3D(a.x, a.y, a.z, b.x, b.y, b.z)
}

/**
 * Reflects a value on a line.
 * @param value - The value to reflect
 * @param midAxis - The line of reflection
 * @returns The reflected value.
 * @public
 */
export function reflectValueOnLine(value: number, midAxis: number): number {
  const diff = Math.abs(midAxis - value)
  return midAxis > value ? value + diff * 2 : value - diff * 2
}
