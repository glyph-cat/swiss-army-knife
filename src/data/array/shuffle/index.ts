import { getRandomNumber } from '../../../random/number'

/**
 * Fisher Yates shuffle.
 * @author Mike Bostock <https://bost.ocks.org/mike/shuffle>
 * @see https://bost.ocks.org/mike/shuffle (adapted)
 * @param array - The array to shuffle.
 * @returns A new array with the items shuffled. Position of elements in the
 * original array remains untouched.
 * @example
 * shuffle([1, 2, 3, 4, 5])
 * @public
 */
export function shuffle<T>(array: Array<T>): Array<T> {
  const localArray = [...array]
  let arrayLength = localArray.length
  // While there remain elements to shuffle…
  while (arrayLength) {
    // Pick a remaining element...
    const randomIndex = getRandomNumber(0, arrayLength--)
    // And swap it with the current element.
    const temporaryItem = localArray[arrayLength]
    localArray[arrayLength] = localArray[randomIndex]
    localArray[randomIndex] = temporaryItem
  }
  return localArray
}
