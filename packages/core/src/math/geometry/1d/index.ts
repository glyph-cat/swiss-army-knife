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
