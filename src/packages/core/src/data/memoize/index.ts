import { arrayIsShallowEqual } from '@glyph-cat/equality'
import { RefObject } from '@glyph-cat/foundation'
import { isUndefined } from '@glyph-cat/type-checking'
import { IS_SOURCE_ENV } from '../../constants'
import { clampedUnshift } from '../array/clamp'

/**
 * A wrapper around any function that will memoize the results based on the
 * arguments passed to the function during invocation.
 * @param callback - The callback to memoize.
 * @returns Either a freshly calculated result or a memoized one.
 * @example
 * const add = (num1: number, num2: number): number => num1 + num2
 * const memoizedAdd = memoize(add)
 * memoizedAdd(1, 2) // `add` is invoked
 * memoizedAdd(1, 2) // `add` is not invoked
 * memoizedAdd(3, 4) // `add` is invoked
 * memoizedAdd(1, 2) // `add` is invoked
 * // ^ Previous results have been overwritten
 * // ^ Use `deepMemoize` for functions that alternate between a fixed set of
 * arguments frequently.
 * @public
 */
export function memoize<A extends Array<unknown>, R>(
  callback: (...args: A) => R,
  areDepsEqual?: (a: A, b: A) => boolean,
): (...args: A) => R {
  areDepsEqual ??= arrayIsShallowEqual
  let cachedArgs: A
  let cachedResult: R
  return (...currentArgs: A): R => {
    if (isUndefined(cachedArgs) || !areDepsEqual(cachedArgs, currentArgs)) {
      const currentResult = callback(...currentArgs)
      cachedResult = currentResult
      cachedArgs = currentArgs
    }
    return cachedResult
  }
}

/**
 * A wrapper around any function that will memoize the results based on the
 * arguments passed to the function during invocation. Number of arguments and
 * results to memoize can be customized.
 * @param callback - The callback to memoize.
 * @param cacheSize - Number of sets of arguments and results to memoize.
 * (Default value: `2`)
 * @returns Either a freshly calculated result or a memoized one.
 * @example
 * const add = (num1: number, num2: number): number => num1 + num2
 * const memoizedAdd = memoize(add)
 * memoizedAdd(1, 2) // `add` is invoked
 * memoizedAdd(1, 2) // `add` is not invoked
 * memoizedAdd(3, 4) // `add` is invoked
 * memoizedAdd(1, 2) // `add` is still not invoked
 * // ^ Previous results are still cached
 * @public
 */
export function deepMemoize<A extends Array<unknown>, R>(
  callback: (...args: A) => R,
  /**
   * @defaultValue `2`
   */
  cacheSize = 2,
  cacheSpy?: RefObject<Array<[A, R]>>
): (...args: A) => R {
  let cacheStack: Array<[A, R]> = []
  return (...currentArgs: A) => {
    for (let i = 0; i < cacheStack.length; i++) {
      const [cachedArgs, cachedResults] = cacheStack[i]
      if (arrayIsShallowEqual(cachedArgs, currentArgs)) {
        // KIV: Probably not worth the effort
        // // Move cached item to front
        // cacheStack.unshift(cacheStack.splice(i, 1)[0])
        return cachedResults // Early exit
      }
    }
    // If cache not hit, begin calculation:
    const currentResult = callback(...currentArgs)
    cacheStack = clampedUnshift(cacheSize, [[currentArgs, currentResult]], cacheStack)
    if (IS_SOURCE_ENV) {
      cacheSpy!.current = cacheStack
    }
    return currentResult
  }
}
