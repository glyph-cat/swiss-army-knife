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
export function createDebouncedCallback(
  callback: () => void,
  timeout?: number
): () => void {
  let timer: ReturnType<typeof setTimeout>
  return (): void => {
    clearTimeout(timer)
    timer = setTimeout(callback, timeout)
  }
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
  let timer: ReturnType<typeof setTimeout>
  return (...args: A): Promise<R> => {
    clearTimeout(timer)
    return new Promise((resolve) => {
      timer = setTimeout(() => {
        resolve(callback(...args))
      }, timeout)
    })
  }
}
