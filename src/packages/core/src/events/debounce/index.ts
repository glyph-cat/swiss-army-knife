import { Nullable, TypedFunction } from '@glyph-cat/foundation'

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
export function createDebouncedCallback<C extends TypedFunction>(
  callback: C,
  timeout?: number,
): C {
  let timeoutRef: ReturnType<typeof setTimeout>
  const debouncedCallback = (...args: any[]) => {
    clearTimeout(timeoutRef)
    timeoutRef = setTimeout(() => { callback(...args) }, timeout)
  }
  return debouncedCallback as C
}

/**
 * Creates a debounced promise.
 * @param callback - The callback to be invoked.
 * @param timeout - The debounce timeout.
 * @returns A promise which the underlying callback is debounced.
 * @example
 * // To refresh components upon window resize:
 * const debouncedFn = createDebouncedPromise(() => { return someValue })
 * const value = await debouncedFn()
 * @public
 */
export function createDebouncedPromise<A extends Array<unknown>, R>(
  callback: (...args: A) => R,
  timeout?: number
): (...args: A) => Promise<R> {
  let timeoutRef: ReturnType<typeof setTimeout>
  let promiseRef: Nullable<Promise<R>> = null
  let resolveRef: Nullable<TypedFunction<[R], void>> = null
  return (...args: A): Promise<R> => {
    if (!promiseRef) {
      promiseRef = new Promise((resolve) => {
        resolveRef = resolve
      })
    }
    clearTimeout(timeoutRef)
    timeoutRef = setTimeout(() => {
      resolveRef(callback(...args))
      resolveRef = null
      promiseRef = null
    }, timeout)
    return promiseRef
  }
}
