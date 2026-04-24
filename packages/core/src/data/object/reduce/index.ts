// NOTE:
// In `Array.reduce`, if `initialValue` is not provided, first value will be used
// and the loop runs from index `1`. We find this behavior confusing and hurts
// performance hence the `initialValue` parameter is made mandatory.

/**
 * Calls the specified callback function for all the elements in an array.
 * The return value of the callback function is the accumulated result,
 * and is provided as an argument in the next call to the callback function.
 *
 * This is an equivalent of [Array.prototype.reduce](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array/reduce) but for objects.
 *
 * @param object - The object to reduce.
 * @param callbackFn - A function that accepts up to five arguments.
 * The reduce method calls the `callbackFn` function one time for each key-value pair in the object.
 * @param initialValue - If `initialValue` is specified, it is used as the
 * initial value to start the accumulation. The first call to the `callbackFn` function
 * provides this value as an argument instead of an array value.
 * Unlike `.reduce` for arrays, however, this parameter is mandatory.
 * @returns The reduced results.
 * @public
 */
export function objectReduce<T, K>(
  object: T,
  callbackFn: (
    previousValue: K,
    currentValue: T[keyof T],
    currentKey: keyof T,
    currentIndex: number,
    object: T,
  ) => K,
  initialValue: K,
): K {
  let index = 0
  for (const key in object) {
    initialValue = callbackFn(initialValue, object[key], key, index, object)
    index += 1
  }
  return initialValue
}
