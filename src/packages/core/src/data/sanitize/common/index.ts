import { isObject } from '@glyph-cat/type-checking'
import { trim } from '../../../string/trim'

/**
 * @public
 */
export namespace Sanitize {

  /**
   * Parses a value into boolean.
   * @param value - The value to be parsed.
   * @returns `true` if value is one of: `true`, `'true'`, `'t'`, `'yes'`, `'y'`, `1`, `'1'`.
   * Otherwise, returns `false`. The values are not case-sensitive.
   * If incorrect types are provided (Eg: an object `{}`) then it returns `false` as well.
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
    return /^(t(rue)?|y(es)?|1)$/i.test(value as string)
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

}
