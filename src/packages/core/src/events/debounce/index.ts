// import { EmptyFunction, Nullable, TypedFunction } from '@glyph-cat/foundation'

/**
 * Creates a debounced callback.
 * @param callback - The callback to be invoked.
 * @param timeout - The debounce timeout.
 * @returns A debounced callback.
 * @example
 * // To refresh components upon window resize:
 * const debouncedFn = createDebouncedCallback(forceUpdateSomeComponents)
 * window.addEventListener('resize', debouncedFn)
 * @public
 */
export function createDebouncedCallback<A extends Array<unknown>>(
  callback: (...args: A) => void,
  timeout?: number,
): (...args: A) => void {
  let timeoutRef: ReturnType<typeof setTimeout>
  const debouncedCallback = (...args: any[]) => {
    clearTimeout(timeoutRef)
    timeoutRef = setTimeout(() => { callback(...args as A) }, timeout)
  }
  return debouncedCallback
}

// /**
//  * Creates a debounced promise.
//  * @param callback - The callback to be invoked.
//  * @param timeout - The debounce timeout.
//  * @returns A promise which the underlying callback is debounced.
//  * @example
//  * // To refresh components upon window resize:
//  * const debouncedFn = createDebouncedPromise(() => { return someValue })
//  * const value = await debouncedFn()
//  * @public
//  */
// export function createDebouncedPromise<A extends Array<unknown>>(
//   callback: (...args: A) => void,
//   timeout?: number
// ): (...args: A) => Promise<void> {
//   let timeoutRef: ReturnType<typeof setTimeout>
//   let promiseRef: Nullable<Promise<void>> = null
//   let resolveRef: EmptyFunction
//   return (...args: A): Promise<void> => {
//     if (!promiseRef) {
//       promiseRef = new Promise((resolve) => {
//         resolveRef = resolve
//       })
//     }
//     clearTimeout(timeoutRef)
//     timeoutRef = setTimeout(() => {
//       callback(...args)
//       resolveRef()
//       promiseRef = null
//     }, timeout)
//     return promiseRef
//   }
// }
