import { getRandomNumber } from '../number'

/**
 * Get a random character from a string.
 * @param string - The list of characters to pick from.
 * @returns A random character.
 * @example
 * pickRandom('abcde')
 * @public
 */
export function pickRandom(string: string): string

/**
 * Get a random item from an array.
 * @param items - The list of items to pick from.
 * @returns A random item.
 * @example
 * pickRandom([1, 2, 3, 4, 5])
 * @public
 */
export function pickRandom<T>(items: Array<T> | string): T

/**
 * @public
 */
export function pickRandom<T>(items: Array<T> | string): T | string {
  return items[getRandomNumber(0, items.length)]
}
