import { arrayIsShallowEqual } from '../../../../../equality/src/array-is-shallow-equal'
import { getRandomNumber } from '../../../random/number'
import { Empty } from '../../empty'

/**
 * Fisher Yates shuffle.
 *
 * NOTE: This _does not_ modify the original array.
 * For mutability, please use {@link shuffleMutable | `shuffleMutable`} instead.
 *
 * @author Mike Bostock <https://bost.ocks.org/mike/shuffle>
 * @see https://bost.ocks.org/mike/shuffle (adapted)
 * @param array - The array to shuffle.
 * @param strict - Makes sure that the shuffled order will not be coincidentally
 * the same as the original one.
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
    while (arrayLength > 0) {
      // Pick a remaining element...
      const randomIndex = getRandomNumber(0, arrayLength--)
      // And swap it with the current element.
      const temporaryItem = newArray[arrayLength]
      newArray[arrayLength] = newArray[randomIndex]
      newArray[randomIndex] = temporaryItem
    }
  } while (strict && array.length > 1 && arrayIsShallowEqual(newArray, array))
  // NOTE: If strict = true and array only has 0 or 1 item, it will result in infinite loop.
  return newArray
}

/**
 * Fisher Yates shuffle.
 *
 * NOTE: This _modifies the original array_.
 * For immutability, please use {@link shuffle | `shuffle`} instead.
 *
 * @author Mike Bostock <https://bost.ocks.org/mike/shuffle>
 * @see https://bost.ocks.org/mike/shuffle (adapted)
 * @param array - The array to shuffle.
 * @param strict - Makes sure that the shuffled order will not be coincidentally
 * the same as the original one.
 * @returns A reference to the original array.
 * @example
 * shuffle([1, 2, 3, 4, 5])
 * @public
 */
export function shuffleMutable<T>(array: Array<T>, strict = false): Array<T> {
  // Only perform shallow copy if strict = true
  const cachedArray = strict ? [...array] : Empty.ARRAY
  do {
    let arrayLength = array.length
    // While there remain elements to shuffle…
    while (arrayLength > 0) {
      // Pick a remaining element...
      const randomIndex = getRandomNumber(0, arrayLength--)
      // And swap it with the current element.
      const temporaryItem = array[arrayLength]
      array[arrayLength] = array[randomIndex]
      array[randomIndex] = temporaryItem
    }
  } while (strict && array.length > 1 && arrayIsShallowEqual(array, cachedArray))
  // NOTE: If strict = true and array only has 0 or 1 item, it will result in infinite loop.
  return array
}
