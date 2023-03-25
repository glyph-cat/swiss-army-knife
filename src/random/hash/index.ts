import { pickRandom } from '../pick'

/**
 * @public
 */
export enum HASH_CHARSET {
  DEFAULT = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789',
  HEX_LOWER_CASE = '0123456789abcdef',
  HEX_UPPER_CASE = '0123456789ABCDEF',
}

/**
 * Creates a hash made of up random characters, given a fixed length.
 * @param length - Length of the hash.
 * @param charset - The set of characters that will make up the hash. Defaults
 * to `HASH_CHARSET.DEFAULT`.
 * @returns The random hash.
 * @public
 */
export function getRandomHash(
  length: number,
  charset: string = HASH_CHARSET.DEFAULT
): string {
  if (length <= 0) {
    throw new RangeError(`Invalid hash length: ${length}`)
  }
  let hash = ''
  while (hash.length < length) {
    hash += pickRandom(charset)
  }
  return hash
}

// ALT
// let previousHash = ''
// function getHash() {
//   let str = previousHash
//   do {
//     const array = new Uint16Array(8)
//     window.crypto.getRandomValues(array)
//     for (let i = 0; i < array.length; i++) {
//       str += String.fromCharCode(array[i])
//     }
//   } while (str === previousHash)
//   previousHash = str
//   return str
// }
