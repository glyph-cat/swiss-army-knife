/**
 * Determine if a value is a symbol.
 * @param value - The value to check.
 * @returns A boolean indicating whether the value is a symbol.
 * @public
 */
export function isSymbol(value: unknown): value is symbol {
  return typeof value === 'symbol'
}
