import { Fn } from '@glyph-cat/foundation'

/**
 * Determine if a value is a function.
 * @param value - The value to check.
 * @example
 * const getSum = (a: number, b: number): number => a + b
 * isFunction<[a: number, b: number], number>(getSum)
 * // NOTE: Type inference is optional
 * @returns A boolean indicating whether the value is a function.
 * @public
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function isFunction<Args extends any[] = any[], Payload = any>(
  value: unknown,
): value is Fn<Args, Payload> {
  return typeof value === 'function'
}
