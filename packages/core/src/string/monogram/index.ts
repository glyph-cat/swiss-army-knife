import { chunk } from '../../data'

/**
 * Derives the letters of a monogram from the given input.
 * @param value - The value to derive the monogram letters from.
 * @param maxLetters - Maximum number of letters allowed in the output.
 * @returns The letters derived from the name that would be used in a monogram.
 * @public
 */
export function getMonogramValue(value: string, maxLetters: number = 2): string {
  const [words] = chunk(value.split(/\s/g), maxLetters)
  return words.map((word) => word[0]).join('')
}
