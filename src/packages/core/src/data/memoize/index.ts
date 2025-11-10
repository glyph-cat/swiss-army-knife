import { IS_INTERNAL_DEBUG_ENV } from '../../constants'
import { clampedUnshift } from '../array/clamp'
import { RefObject } from '../ref'
import { isUndefined } from '../type-check'

/**
 * A equality checking function similar to React's.
 * @param deps1 - First set of dependencies
 * @param deps2 - Second set of dependencies
 * @returns A boolean indicating whether both sets of dependencies are equal.
 * @example
 * const deps1 = [42, true, 'foo']
 * const deps2 = [42, false, 'bar']
 * const areEqual = areDepsEqual(deps1, deps2)
 * @public
 */
export function areDepsEqual(
  deps1: Array<unknown>,
  deps2: Array<unknown>,
): boolean {
  if (deps1.length !== deps2.length) { return false } // Early exit
  for (let i = 0; i < deps1.length; i++) {
    if (!Object.is(deps1[i], deps2[i])) { return false } // Early exit
  }
  return true
}

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
): (...args: A) => R {
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
      if (areDepsEqual(cachedArgs, currentArgs)) {
        // KIV: Probably not worth the effort
        // // Move cached item to front
        // cacheStack.unshift(cacheStack.splice(i, 1)[0])
        return cachedResults // Early exit
      }
    }
    // If cache not hit, begin calculation:
    const currentResult = callback(...currentArgs)
    cacheStack = clampedUnshift(cacheSize, [[currentArgs, currentResult]], cacheStack)
    if (IS_INTERNAL_DEBUG_ENV) {
      cacheSpy!.current = cacheStack
    }
    return currentResult
  }
}
