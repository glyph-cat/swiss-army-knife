/**
 * Determine if a character is lower case. If the string contains more than `1`
 * character, they remaining ones are ignored.
 * @param char - The character to check.
 * @returns A boolean indicating whether the character is lower case.
 * @example
 * isLowerCase('a') // true
 * isLowerCase('A') // false
 * @public
 */
export function isLowerCase(char: string): boolean {
  return char?.[0] ? char[0] === char[0].toLowerCase() : false
}

/**
 * Determine if a character is upper case. If the string contains more than `1`
 * character, they remaining ones are ignored.
 * @param char - The character to check.
 * @returns A boolean indicating whether the character is upper case.
 * @example
 * isUpperCase('A') // true
 * isUpperCase('a') // false
 * @public
 */
export function isUpperCase(char: string): boolean {
  return char?.[0] ? char[0] === char[0]?.toUpperCase() : false
}
