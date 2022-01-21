import { isThenable } from '../../data/type-check'
import { JSFunction } from '../../types'

/**
 * Only try executing code but don't catch if there are any errors. Use sparingly.
 * @param callback - The callback to try.
 * @example
 * tryOnly(() => {
 *   someMethodThatMightThrowError()
 * })
 * @example
 * await tryOnly(async () => {
 *   await someMethodThatMightThrowError()
 * })
 * @public
 */
export function tryOnly(
  callback: JSFunction | (() => Promise<unknown>)
): void | Promise<void> {
  try {
    const executedCallback = callback()
    if (isThenable(executedCallback)) {
      return new Promise((resolve) => {
        executedCallback.then(() => { resolve() })
      })
    }
  } catch (e) {
    // Do nothing
  }
}
