import { getRandomNumber } from '../../../random/number'

/**
 * Fisher Yates shuffle.
 * @author Mike Bostock <https://bost.ocks.org/mike/shuffle>
 * @see https://bost.ocks.org/mike/shuffle (adapted)
 * @param array - The array to shuffle.
 * @param strict - Makes sure that the shuffled array is not the same as the
 * original one.
 * @returns A new array with the items shuffled. Position of elements in the
 * original array remains untouched.
 * @example
 * shuffle([1, 2, 3, 4, 5])
 * @public
 */
export function shuffle<T>(array: Array<T>, strict = false): Array<T> {
  const newArray = [...array]
  do {
    let arrayLength = newArray.length
    // While there remain elements to shuffle…
    while (arrayLength) {
      // Pick a remaining element...
      const randomIndex = getRandomNumber(0, arrayLength--)
      // And swap it with the current element.
      const temporaryItem = newArray[arrayLength]
      newArray[arrayLength] = newArray[randomIndex]
      newArray[randomIndex] = temporaryItem
    }
  } while (strict && shallowEqual(array, newArray))
  return newArray
}

function shallowEqual<T>(a: Array<T>, b: Array<T>): boolean {
  // Lengths should be the same but just in case
  if (a.length !== b.length) { return false } // Early exit
  for (let i = 0; i < a.length; i++) {
    if (!Object.is(a[i], b[i])) { return false } // Early exit
  }
  return true
}
