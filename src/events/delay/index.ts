import { createGCFactoryObject, GCFunctionalObject } from '../../bases'
import { JSFunction } from '../../types'

/**
 * Create an empty promise that is resolved after a specified time. The delay
 * cannot be cancelled once executed. To create a cancellable delay, use
 * `createAdjustableDelay` instead.
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
export interface AdjustableDelay extends GCFunctionalObject {
  /**
   * Run the delay.
   */
  now(): Promise<void>
  /**
   * ## Placeholder property - not yet available
   * Add time to the delay. Only effective if the delay has not yet resolved.
   */
  add(time: number): void
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
 * const adjustableDelay = createAdjustableDelay()
 *
 * // Run and wait
 * await adjustableDelay.now()
 *
 * // Add more time
 * await adjustableDelay.add(1000)
 *
 * // Cancel
 * adjustableDelay.cancel()
 * @public
 */
export function createAdjustableDelay(time: number): AdjustableDelay {
  const $factoryObject = createGCFactoryObject()
  // TODO: Test
  // TODO: Add time to delay if not yet resolved
  let timeoutRef: ReturnType<typeof setTimeout>
  let resolveRef: JSFunction
  const now = (): Promise<void> => {
    return new Promise((resolve) => {
      resolveRef = resolve
      timeoutRef = setTimeout(() => { resolve() }, time)
    })
  }
  /* eslint-disable */
  const add = (time: number): void => {
    // ...
  }
  /* eslint-enable */
  const cancel = (): void => {
    clearTimeout(timeoutRef)
    resolveRef()
  }
  return {
    ...$factoryObject,
    now,
    add,
    cancel,
  }
}
