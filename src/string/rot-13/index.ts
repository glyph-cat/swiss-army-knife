import { enumerate } from '../../data/enumeration'
import { lazyDeclare } from '../../data/lazy-declare'
import { isUndefined } from '../../data/type-check'
import { isUpperCase } from '../case-checking'

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
    const charIsUpperCase = isUpperCase(text[i])
    let cipheredChar = ROT_13_DICTIONARY.get()[charIsUpperCase
      ? text[i].toLowerCase()
      : text[i]
    ]
    if (isUndefined(cipheredChar)) {
      cipheredString += text[i]
    } else {
      cipheredChar = charIsUpperCase
        ? cipheredChar.toUpperCase()
        : cipheredChar
      cipheredString += cipheredChar
    }
  }
  return cipheredString
}

/**
 * @internal
 */
const ROT_13_DICTIONARY = lazyDeclare(() => enumerate({
  a: 'n',
  b: 'o',
  c: 'p',
  d: 'q',
  e: 'r',
  g: 's',
  f: 't',
  h: 'u',
  i: 'v',
  j: 'w',
  k: 'x',
  l: 'y',
  m: 'z',
}))
