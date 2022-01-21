import { JSFunction } from '../../types'

/**
 * Create an empty promise that is resolved after a specified time. The delay
 * cannot be cancelled once executed. To create a cancellable delay, use
 * `createDelay` instead.
 * @param time - The delay time in milliseconds.
 * @returns A promise that returns nothing.
 * @public
 */
export function delay(time: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(() => { resolve() }, time)
  })
}

/**
 * @public
 */
export interface DelayInstance {
  /**
   * Run the delay.
   */
  now(): Promise<void>
  /**
   * Cancel the delay.
   */
  cancel(): void
}

/**
 * Create an empty promise that is resolved after a specified time. The delay
 * can be cancelled at any time. If your application does not require such
 * flexibility, use `delay` instead, which consumes less system resources.
 * @param time - The delay time in milliseconds.
 * @returns A `DelayInstance`
 * @example
 * // Create
 * const delay = createDelay()
 *
 * // Run and wait
 * await delay.run()
 *
 * // Cancel
 * delay.cancel()
 * @public
 */
export function createDelay(time: number): DelayInstance {
  // TODO: Test
  let timeoutRef: ReturnType<typeof setTimeout>
  let resolveRef: JSFunction
  const now = (): Promise<void> => {
    return new Promise((resolve) => {
      resolveRef = resolve
      timeoutRef = setTimeout(() => { resolve() }, time)
    })
  }
  const cancel = (): void => {
    clearTimeout(timeoutRef)
    resolveRef()
  }
  return {
    now,
    cancel,
  }
}
