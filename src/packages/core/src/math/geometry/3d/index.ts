import { Value3D } from '../../abstractions'

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
 * Calculates the angle from two vectors based on their points.
 * @param a1 - First point of the first vector.
 * @param a2 - Second point of the first vector.
 * @param b1 - First point of the second vector.
 * @param b2 - Second point of the second vector.
 * @returns Angle of the two vectors in radians.
 * @public
 */
export function getAngleFromPointsIn3D(
  a1: Value3D,
  a2: Value3D,
  b1: Value3D,
  b2: Value3D,
): number {
  const vectorA: Value3D = {
    x: a2.x - a1.x,
    y: a2.y - a1.y,
    z: a2.z - a1.z,
  }
  const vectorB: Value3D = {
    x: b2.x - b1.x,
    y: b2.y - b1.y,
    z: b2.z - b1.z,
  }
  return getAngleOfVectorsIn3D(vectorA, vectorB)
}
