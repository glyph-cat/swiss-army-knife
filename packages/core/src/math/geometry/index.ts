/**
 * Gets the distance between two 2D points.
 * @param x1 - X value of the first point
 * @param y1 - Y value of the first point
 * @param x2 - X value of the second point
 * @param y2 - Y value of the second point
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
