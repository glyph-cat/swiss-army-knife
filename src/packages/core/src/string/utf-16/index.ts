/**
 * Converts plaintext to UTF-16 string.
 * @param text - The text to convert.
 * @param compact - When `true`, encodes characters as `'\u{xx}'` instead of `'\u{00xx}'`.
 * @returns The string encoded in UTF-16.
 * @public
 */
export function encodeUTF16(text: string, compact?: boolean): string {
  const buffer = new ArrayBuffer(text.length * 2)
  const bufferArray = new Uint16Array(buffer)
  for (let i = 0; i < text.length; i++) {
    bufferArray[i] = text.charCodeAt(i)
  }
  if (compact) {
    return bufferArray.reduce((acc, bufferValue) => {
      return acc + '\\u{' + bufferValue.toString(16) + '}'
    }, '')
  } else {
    return bufferArray.reduce((acc, bufferValue) => {
      return acc + '\\u' + bufferValue.toString(16).padStart(4, '0')
    }, '')
  }
}

/**
 * Converts UTF-16 string to plaintext.
 * @param text - The text to convert.
 * @returns The string decoded from UTF-16.
 * @public
 */
export function decodeUTF16(text: string): string {
  return text.replace(/[{}]/g, '').split(/\\u/).reduce((acc, character) => {
    return acc + String.fromCharCode(parseInt(character, 16))
  })
}
