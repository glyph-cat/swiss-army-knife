import { GCObject } from '../../bases'
import { devError } from '../../dev'
import { JSFunction } from '../../types'
import { delay } from '../delay'

/**
 * @public
 */
export class VaryingInterval extends GCObject {

  private callback: JSFunction
  private intervalRef: ReturnType<typeof setInterval>

  /**
   * @param callback - The callback to run at the varying intervals.
   * @example
   * new VaryingInterval(() => {
   *   console.log('Hello, world!')
   * })
   */
  constructor(callback: JSFunction) {
    super()
    this.callback = callback
  }

  /**
   * Run the callback with an interval. If there is an interval already exists,
   * it will be replaced with the new one.
   * @example
   * myVaryingInterval.start(1000)
   */
  start(interval: number): void {
    this.stop()
    this.intervalRef = setInterval(this.callback, interval)
  }

  /**
   * Stops the interval.
   * myVaryingInterval.stop(1000)
   */
  stop(): void {
    clearInterval(this.intervalRef)
  }

}

/**
 * @public
 */
export class LongPollingInterval extends GCObject {

  shouldRun: boolean
  callback: JSFunction
  interval: number

  /**
   * @param callback - The callback to run.
   * @param interval - The interval at which the callback will be invoked in
   * milliseconds.
   * @example
   * const myLongPollingInterval = new LongPollingInterval(
   *   () => { fetchSomeDataAndUpdateState() },
   *   3000
   * )
   */
  constructor(callback: JSFunction, interval: number) {
    super()
    this.callback = callback
    this.interval = interval
  }

  private runLoop = async (): Promise<void> => {
    while (this.shouldRun) {
      const callbackPromise = this.callback()
      const delayPromise = delay(this.interval)
      await Promise.all([callbackPromise, delayPromise])
      // Explanation:
      // If callback completes early, wait for delay
      // If callback completes late, cycle is completed and run again
    }
  }

  async start(): Promise<void> {
    if (this.shouldRun) {
      devError(
        `($id: ${this.$id}) Cannot start a long polling ` +
        'interval that is already running.'
      )
      return // Early exit
    }
    this.shouldRun = true
    await this.runLoop()
  }

  stop(): void {
    this.shouldRun = false
  }

}
