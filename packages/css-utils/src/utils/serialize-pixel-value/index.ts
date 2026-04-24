import { isNumber } from '@glyph-cat/type-checking'

/**
 * Converts number to pixel string, and leaves string values untouched.
 * @param value - The value to serialize.
 * @returns The serialized value.
 * @example
 * serializePixelValue('42') // '42'
 * serializePixelValue(42)   // '42px'
 * @public
 */
export function serializePixelValue(value: number | string): string {
  return isNumber(value) ? `${value}px` : value
}
