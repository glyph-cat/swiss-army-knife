import { removeDuplicates } from '../../data'

/**
 * @example
 * import { Charset } from '@glyph-cat/foundation'
 *
 * createCustomCharset(
 *   Charset.ALPHANUMERIC_LOWER,
 *   '_-', // add underscore and dash
 * )
 * @public
 */
export function createCustomCharset(...charsets: Array<string>): string {
  return removeDuplicates(charsets.join('').split('')).join('')
}
