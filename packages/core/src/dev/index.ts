import { ReadWritableArray } from '@glyph-cat/foundation'
import { isString } from '@glyph-cat/type-checking'
import { IS_DEBUG_ENV } from '../constants'

/**
 * @public
 */
export type DevLogType = 'info' | 'warn' | 'error'

/**
 * A wrapper around console methods.
 * @public
 */
export function devPrint(
  type: DevLogType,
  ...message: unknown[]
): void {
  if (IS_DEBUG_ENV) {
    // eslint-disable-next-line no-console
    console[type](...message)
  }
}

/**
 * Equivalent of `console.info`.
 * It is okay to use `console.log` during development, but remember to remove
 * them after debugging is complete.
 * @public
 */
export function devInfo(...message: unknown[]): void {
  devPrint('info', ...message)
}

/**
 * Equivalent of `console.warn`.
 * @public
 */
export function devWarn(...message: unknown[]): void {
  devPrint('warn', ...message)
}

/**
 * Equivalent of `console.error`.
 * @public
 */
export function devError(...message: unknown[]): void {
  devPrint('error', ...message)
}

/**
 * @param array - The array to concatenate.
 * @returns The concatenated array.
 * @example
 * const output = displayStringArray(['foo', 42, true])
 * console.log(output) // ['foo', '42', 'true']
 * @public
 */
export function displayStringArray(array: unknown[]): string {
  if (array.length <= 0) {
    return '[]'
  } else {
    return `['${array.join('\', \'')}']`
  }
}

/**
 * @param array - The array to concatenate.
 * @returns The concatenated array.
 * @example
 * const output = displayMixedArray(['foo', 42, true, Symbol('meow')])
 * console.log(output) // ['foo', 42, true, Symbol(meow)]
 * @public
 */
export function displayMixedArray(array: ReadWritableArray<unknown>): string {
  const strStack = []
  for (const item of array) {
    strStack.push(isString(item) ? `'${item}'` : String(item))
  }
  return `[${strStack.join(', ')}]`
}

/**
 * Express the items of an array as an object notation.
 * @param pathStack - The paths pointing to a child in an object.
 * @returns The concatenated path.
 * @example ['user', 'address', 'street', '1'] -> user.address.street[1]
 * @public
 */
export function displayObjectPath(pathStack: ReadWritableArray<string>): string {
  let str = ''
  for (const path of pathStack) {
    // Dots will be used as long as it starts with letters
    str += path.match(/^[a-z]/i) ? `.${path}` : `['${path}']`
  }
  // If the string starts with a dot, it will be removed though
  if (str.match(/^\./)) {
    str = str.replace(/^\./, '')
  }
  return `\`${str}\``
}

/**
 * @param num - The number to format.
 * @returns The formatted number.
 * @example
 * displayOrdinalNumber(1) // 1st
 * displayOrdinalNumber(2) // 2nd
 * displayOrdinalNumber(3) // 3rd
 * displayOrdinalNumber(4) // 4th
 * @public
 */
export function displayOrdinalNumber(num: number | string): string {
  const numString = num.toString()
  const lastDigit = numString[numString.length - 1]
  if (lastDigit === '1' && !numString.match(/11$/)) {
    return `${num}st`
  } else if (lastDigit === '2' && !numString.match(/12$/)) {
    return `${num}nd`
  } else if (lastDigit === '3' && !numString.match(/13$/)) {
    return `${num}rd`
  } else {
    return `${num}th`
  }
}
