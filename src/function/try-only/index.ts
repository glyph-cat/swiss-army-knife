import { isThenable } from '../../data/type-check'
import { TypedFunction } from '../../types'

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
  callback: TypedFunction<[], void | Promise<void>>
): void | Promise<void> {
  try {
    const executedCallback = callback()
    if (isThenable(executedCallback)) {
      return new Promise((resolve) => {
        executedCallback.then(() => { resolve() })
      })
    }
  } catch (e) { // eslint-disable-line @typescript-eslint/no-unused-vars
    // Do nothing
  }
}
