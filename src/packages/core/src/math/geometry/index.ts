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
export function getDistance3DByCoordinates(a: Value3D, b: Value3D): number {
  return getDistance3D(a.x, a.y, a.z, b.x, b.y, b.z)
}

/**
 * Calculates the angle from two vectors.
 * @param a - The first vector.
 * @param b - The second vector.
 * @returns Angle of the two vectors in radians.
 * @public
 */
export function getAngleOfVectorsIn3D(a: Value3D, b: Value3D): number {
  const dotProduct = a.x * b.x + a.y * b.y + a.z * b.z
  const magnitudeA = Math.pow(a.x, 2) + Math.pow(a.y, 2) + Math.pow(a.z, 2)
  const magnitudeB = Math.pow(b.x, 2) + Math.pow(b.y, 2) + Math.pow(b.z, 2)
  return Math.acos(dotProduct / Math.sqrt(magnitudeA * magnitudeB))
}

/**
 * Calculates the angle from three points.
 * @param midPoint - The middle point.
 * @param a - The first point.
 * @param b - The second point.
 * @returns Angle of the three points in radians.
 * @public
 */
export function getAngleFromPointsIn3D(
  midPoint: Value3D,
  a: Value3D,
  b: Value3D,
): number {
  const vectorA: Value3D = {
    x: midPoint.x - a.x,
    y: midPoint.y - a.y,
    z: midPoint.z - a.z,
  }
  const vectorB: Value3D = {
    x: midPoint.x - b.x,
    y: midPoint.y - b.y,
    z: midPoint.z - b.z,
  }
  return getAngleOfVectorsIn3D(vectorA, vectorB)
}

/**
 * Reflects a value along an axis.
 * @param value - The value to reflect.
 * @param midPoint - The point of reflection.
 * @returns The reflected value.
 * @public
 */
export function reflect1D(value: number, midPoint: number): number {
  const diff = Math.abs(midPoint - value)
  return midPoint > value ? value + diff * 2 : value - diff * 2
}
