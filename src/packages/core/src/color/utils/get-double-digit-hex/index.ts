/**
 * @example
 * getDoubleDigitHex(9) // '09'
 * getDoubleDigitHex(255) // 'ff'
 * @public
 */
export function getDoubleDigitHex(value: number): string {
  return Math.round(value).toString(16).padStart(2, '0')
}
