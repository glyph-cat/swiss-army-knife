import { createGCFactoryObject, GCFunctionalObject } from '../../bases'
import { devError } from '../../dev'
import { JSFunction } from '../../types'
import { delay } from '../delay'

/**
 * @public
 */
interface VaryingInterval extends GCFunctionalObject {
  /**
   * Run the callback with an interval. If there is an interval already exists,
   * it will be replaced with the new one.
   */
  start(interval: number): void
  /**
   * Stops the interval.
   */
  stop(): void
}

/**
 * @public
 */
export function createVaryingInterval<C extends JSFunction>(
  callback: C
): VaryingInterval {
  const $factoryObject = createGCFactoryObject()
  let intervalRef: ReturnType<typeof setInterval>
  const stop = (): void => {
    clearInterval(intervalRef)
  }
  const start = (interval: number): void => {
    stop()
    intervalRef = setInterval(callback, interval)
  }
  return {
    ...$factoryObject,
    start,
    stop,
  }
}

/**
 * @public
 */
export interface LongPollingInterval extends GCFunctionalObject {
  start(): Promise<void>
  stop(): void
}

/**
 * @public
 * @example // TODO
 */
export function createLongPollingInterval(
  callback: JSFunction,
  interval: number
): LongPollingInterval {
  const $factoryObject = createGCFactoryObject()
  let shouldRun = true
  const runLoop = async (): Promise<void> => {
    while (shouldRun) {
      const callbackPromise = callback()
      const delayPromise = delay(interval)
      await Promise.all([callbackPromise, delayPromise])
      // Explanation:
      // If callback completes early, wait for delay
      // If callback completes late, cycle is completed and run again
    }
  }
  const start = async () => {
    if (shouldRun) {
      devError(
        `($id: ${$factoryObject.$id}) Cannot start a long polling ` +
        'interval that is already running.'
      )
      return // Early exit
    }
    shouldRun = true
    await runLoop()
  }
  const stop = () => {
    shouldRun = false
  }
  return {
    ...$factoryObject,
    start,
    stop,
  }
}
