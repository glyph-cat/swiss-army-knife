import { isObject, isString } from '../type-check'

/**
 * @public
 */
// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace Sanitize {

  /**
   * Parses a value into boolean.
   * @param value - The value to be parsed.
   * @returns `true` if value is one of: `true`, `1`, `'true'`, `'1'`, `'yes'`,
   * `'y'`. String values are not case-sensitive.
   * @example
   * Boolean(1) // true
   * Sanitize.toBoolean(1) // true
   *
   * Boolean('yESSSSSS') // true
   * Sanitize.toBoolean('yESSSSSS') // false
   *
   * Boolean('No') // true
   * Sanitize.toBoolean('No') // false
   * @public
   */
  export function toBoolean(value: unknown): boolean {
    if (value === true) {
      return true
    } else if (value === 1) {
      return true
    } else if (isString(value)) {
      return ['true', '1', 'yes', 'y'].includes(trim(value).toLowerCase())
    }
    return false
  }

  /**
   * Parses a value into string and removes any leading and trailing whitespaces,
   * tabs, or empty lines.
   * @param value - The value to be parsed.
   * @returns The parsed string.
   * @example
   * Sanitize.toString('   1') // '1'
   * Sanitize.toString(42) // '42'
   * Sanitize.toString({ firstName: 'John' }) // '{"firstName":"John"}'
   * @public
   */
  export function toString(value: unknown): string {
    return isObject(value) ? JSON.stringify(value) : trim(String(value))
  }

  /**
   * Removes any leading and trailing whitespaces, tabs, or empty lines from a string.
   * @param value - The string to be trimmed.
   * @returns The trimmed string.
   * @example
   * Sanitize.toString('  \t foo bar\n\n') // 'foo bar'
   * @public
   */
  export function trim(value: string): string {
    return value.replace(/(^(\s|\n|\t)+|(\s|\n|\t)+$)/g, '')
  }

}
