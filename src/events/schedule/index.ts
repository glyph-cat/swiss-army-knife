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

  private isActive = true
  private callback: JSFunction
  private triggerTime: Date
  private timeoutId: ReturnType<typeof setTimeout>

  /**
   * @param callback - The callback to be scheduled.
   * @param triggerTime - Date and time of when the callback should be invoked.
   * @example
   * const myScheduledCallback = new ScheduledCallback(someFunction, 3000)
   */
  constructor(callback: () => void, triggerTime: Date) {
    super()
    this.callback = callback
    this.triggerTime = triggerTime
  }

  /**
   * Run the scheduled callback.
   * @example
   * const myScheduledCallback = new ScheduledCallback(someFunction, 3000)
   * myScheduledCallback.run()
   * // `myScheduledCallback` will be runned invoked seconds later.
   */
  run(): void {
    const timeout = Math.max(0, this.triggerTime.getTime() - new Date().getTime())
    this.timeoutId = setTimeout(() => {
      this.callback()
      this.isActive = false
    }, timeout)
  }

  /**
   * Cancel the schedule.
   * @example
   * myScheduledCallback.clear()
   */
  clear(): void {
    clearTimeout(this.timeoutId)
    this.isActive = false
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
    if (!this.isActive) {
      this.callback()
    }
  }

}
