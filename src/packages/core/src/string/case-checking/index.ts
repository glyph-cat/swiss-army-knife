import { isString } from '../../data'

/**
 * Determine if a whole string is lower case.
 * @param value - The string to check.
 * @returns A boolean indicating whether the whole string is lower case.
 * @example
 * isLowerCase('hello world') // true
 * isLowerCase('Hello World') // false
 * isUpperCase('HELLO WORLD') // false
 * @public
 */
export function isLowerCase(value: string): value is Lowercase<string> {
  return isString(value) ? value === value.toLowerCase() : true
}

/**
 * Determine if a whole string is upper case.
 * @param value - The string to check.
 * @returns A boolean indicating whether the whole string is upper case.
 * @example
 * isUpperCase('HELLO WORLD') // true
 * isUpperCase('Hello World') // false
 * isUpperCase('hello world') // false
 * @public
 */
export function isUpperCase(value: string): value is Uppercase<string> {
  return isString(value) ? value === value.toUpperCase() : true
}
