import { removeDuplicates } from '../../data'

/**
 * @public
 */
export const Charset = {
  DEFAULT: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789',
  NUMERIC: '0123456789',
  HEX_LOWER: '0123456789abcdef',
  HEX_UPPER: '0123456789ABCDEF',
  ALPHABET_LOWER: 'abcdefghijklmnopqrstuvwxyz',
  ALPHABET_UPPER: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  ALPHANUMERIC_LOWER: 'abcdefghijklmnopqrstuvwxyz0123456789',
  ALPHANUMERIC_UPPER: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789',
} as const

/**
 * @example
 * createCustomCharset(
 *   Charset.ALPHANUMERIC_LOWER,
 *   '_-', // add underscore and dash
 * )
 * @public
 */
export function createCustomCharset(...charsets: Array<string>): string {
  return removeDuplicates(charsets.join('').split('')).join('')
}
