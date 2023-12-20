import { GCObject } from '../../bases'
import { isFunction, isNumber } from '../../data'
import { devError } from '../../dev'
import { JSFunction } from '../../types'
import { delay } from '../delay'

/**
 * @public
 */
export class VaryingInterval extends GCObject {

  private M$callback: JSFunction
  private M$intervalRef: ReturnType<typeof setInterval>

  /**
   * @param callback - The callback to run at the varying intervals.
   * @example
   * new VaryingInterval(() => {
   *   console.log('Hello, world!')
   * })
   */
  constructor(callback: JSFunction) {
    super()
    this.M$callback = callback
  }

  /**
   * Run the callback with an interval. If there is an interval already exists,
   * it will be replaced with the new one.
   * @example
   * myVaryingInterval.start(1000)
   */
  start(interval: number): void {
    this.stop()
    // @ts-expect-error Not sure why return type is different
    this.M$intervalRef = setInterval(this.M$callback, interval)
  }

  /**
   * Stops the interval.
   * myVaryingInterval.stop(1000)
   */
  stop(): void {
    clearInterval(this.M$intervalRef)
  }

}

/**
 * @public
 */
export class LongPollingInterval extends GCObject {

  /**
   * @internal
   */
  private M$shouldRun: boolean

  /**
   * @internal
   */
  private readonly M$callback: JSFunction

  /**
   * @internal
   */
  private readonly M$interval: number | (() => number)

  /**
   * @param callback - The callback to run.
   * @param interval - The interval at which the callback will be invoked in
   * milliseconds.
   * @example
   * const myLongPollingInterval = new LongPollingInterval(
   *   () => { fetchSomeDataAndUpdateState() },
   *   3000 // Fixed interval
   * )
   * @example
   * const myLongPollingInterval = new LongPollingInterval(
   *   () => { fetchSomeDataAndUpdateState() },
   *   () => (1 + Math.floor(Math.random() * 10)) * 1000
   *   // Random interval between 1 to 10 seconds
   * )
   */
  constructor(callback: JSFunction, interval: number | (() => number)) {
    super()
    this.M$callback = callback
    this.M$interval = interval
    this.start = this.start.bind(this)
    this.stop = this.stop.bind(this)
  }

  /**
   * @internal
   */
  private M$getInterval = (): number => {
    if (isNumber(this.M$interval)) {
      return this.M$interval
    } else if (isFunction(this.M$interval)) {
      const generatedInterval = this.M$interval()
      if (!isNumber(generatedInterval)) {
        throw new Error(`Generated interval is invalid: ${String(generatedInterval)}`)
      }
      return generatedInterval
    } else {
      throw new Error(`Invalid interval: ${String(this.M$interval)}`)
    }
  }

  /**
   * @internal
   */
  private M$runLoop = async (): Promise<void> => {
    while (this.M$shouldRun) {
      const callbackPromise = this.M$callback()
      const delayPromise = delay(this.M$getInterval())
      await Promise.all([callbackPromise, delayPromise])
      // Explanation:
      // If callback completes early, wait for delay
      // If callback completes late, cycle is completed and run again
    }
  }

  async start(): Promise<void> {
    if (this.M$shouldRun) {
      devError(`${LongPollingInterval.name} ($id: ${this.$id}) is already running.`)
      return // Early exit
    }
    this.M$shouldRun = true
    await this.M$runLoop()
  }

  stop(): void {
    this.M$shouldRun = false
  }

}
