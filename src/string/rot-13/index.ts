import { enumerate } from '../../data/enumeration'
import { LazyVariable } from '../../data/lazy-variable'
import { isUndefined } from '../../data/type-check'

/**
 * Ciphers a string with rot-13.
 * @param text - The text to cipher.
 * @returns The ciphered string.
 * @example
 * rot13('Hello, world!') // Uryyb, jbeyq!
 * @public
 */
export function rot13(text: string): string {
  let cipheredString = ''
  for (let i = 0; i < text.length; i++) {
    const cipheredChar = ROT_13_DICTIONARY.get()[text[i]]
    cipheredString += isUndefined(cipheredChar) ? text[i] : cipheredChar
  }
  return cipheredString
}

/**
 * @internal
 */
const ROT_13_DICTIONARY = new LazyVariable(() => enumerate({
  a: 'n',
  b: 'o',
  c: 'p',
  d: 'q',
  e: 'r',
  f: 's',
  g: 't',
  h: 'u',
  i: 'v',
  j: 'w',
  k: 'x',
  l: 'y',
  m: 'z',
  A: 'N',
  B: 'O',
  C: 'P',
  D: 'Q',
  E: 'R',
  F: 'S',
  G: 'T',
  H: 'U',
  I: 'V',
  J: 'W',
  K: 'X',
  L: 'Y',
  M: 'Z',
}))
