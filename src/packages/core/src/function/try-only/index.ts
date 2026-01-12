import { isThenable } from '@glyph-cat/type-checking'

/**
 * Only try executing code but don't catch if there are any errors. Use sparingly.
 * @param callback - The callback to try.
 * @example
 * await tryOnly(async () => {
 *   await someAsyncMethodThatMightThrowError()
 * })
 * @public
 * @returns `true` if the callback does not throw any error, otherwise `false`.
 */
export function tryOnly(callback: () => Promise<void>): Promise<boolean>

/**
 * Only try executing code but don't catch if there are any errors. Use sparingly.
 * @param callback - The callback to try.
 * @example
 * tryOnly(() => {
 *   someMethodThatMightThrowError()
 * })
 * @public
 * @returns `true` if the callback does not throw any error, otherwise `false`.
 */
export function tryOnly(callback: () => void): boolean

export function tryOnly(
  callback: () => void | Promise<void>,
): boolean | Promise<boolean> {
  try {
    const executedCallback = callback()
    if (isThenable(executedCallback)) {
      return new Promise((resolve) => {
        executedCallback.catch(() => {
          resolve(false)
        }).finally(() => {
          resolve(true)
        })
      })
    }
  } catch (e) { // eslint-disable-line @typescript-eslint/no-unused-vars
    return false
  }
  return true
}
