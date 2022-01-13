import { MutableRefObject } from 'react'
import { delay } from '../../events/delay'

/**
 * Determine if a promise has been resolved.
 * @param promise - The promise to check.
 * @returns A boolean indicating whether the promise has been resolved.
 * @example
 * // Asynchronous usage
 * async function exampleCallback(): Promise<void> {
 *   // ...
 * }
 * const examplePromise = exampleCallback()
 * const isPromiseResolved = await isResolved(examplePromise)
 * console.log(isPromiseResolved)
 * @example
 * // Synchronous usage
 * async function exampleCallback(): Promise<void> {
 *   // ...
 * }
 * const examplePromise = exampleCallback()
 * const isPromiseResolved = { current: false }
 * isResolved(examplePromise, isPromiseResolved)
 * console.log(isPromiseResolved.current)
 * @public
 */
export function isResolved(
  promise: Promise<unknown>,
  flag?: MutableRefObject<boolean>
): Promise<boolean> | void {
  if (flag) {
    promise.then((): void => {
      flag.current = true
    })
  } else {
    let internalFlag = false
    promise.then((): void => {
      internalFlag = true
    })
    return new Promise((resolve): void => {
      // This gives then `.then` callback some time to execute.
      delay(0).then((): void => {
        resolve(internalFlag)
      })
    })
  }
}


export function isResolved2(
  promise: Promise<unknown>,
  flag: MutableRefObject<boolean>
): void {
  promise.then((): void => {
    flag.current = true
  })
}
