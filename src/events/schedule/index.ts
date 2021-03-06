import { JSFunction } from '../../types'
import { GCObject } from '../../bases'

/**
 * Set a specific date and time for a callback to be invoked.
 *
 * NOTE: This schedule will not be kept tracked if the webpage or mobile app is
 * closed then reopened again at a later time.
 * @public
 */
export class ScheduledCallback extends GCObject {

  private M$isActive = true
  private M$callback: JSFunction
  private M$triggerTime: Date
  private M$timeoutId: ReturnType<typeof setTimeout>

  /**
   * @param callback - The callback to be scheduled.
   * @param triggerTime - Date and time of when the callback should be invoked.
   * @example
   * const myScheduledCallback = new ScheduledCallback(someFunction, 3000)
   */
  constructor(callback: () => void, triggerTime: Date) {
    super()
    this.M$callback = callback
    this.M$triggerTime = triggerTime
  }

  /**
   * Run the scheduled callback.
   * @example
   * const myScheduledCallback = new ScheduledCallback(someFunction, 3000)
   * myScheduledCallback.run()
   * // `myScheduledCallback` will be runned invoked seconds later.
   */
  run(): void {
    const timeout = Math.max(0, this.M$triggerTime.getTime() - new Date().getTime())
    this.M$timeoutId = setTimeout(() => {
      this.M$callback()
      this.M$isActive = false
    }, timeout)
  }

  /**
   * Cancel the schedule.
   * @example
   * myScheduledCallback.clear()
   */
  clear(): void {
    clearTimeout(this.M$timeoutId)
    this.M$isActive = false
  }

  /**
   * Cancel the schedule and immediately trigger its callback.
   * @example
   * myScheduledCallback.flush()
   * // `myScheduledCallback` will be invoked immediately if the scheduled time
   * has not passed.
   */
  flush(): void {
    this.clear()
    if (!this.M$isActive) {
      this.M$callback()
    }
  }

}
