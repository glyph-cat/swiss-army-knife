import { createGCFactoryObject, GCFunctionalObject } from '../../bases'

/**
 * @public
 */
export interface ScheduledCallback extends GCFunctionalObject {
  /**
   * Cancel the schedule.
   */
  clear: () => void
  /**
   * Cancel the schedule and immediately trigger its callback.
   */
  flush: () => void
}

/**
 * Set a specific date and time for a callback to be invoked.
 *
 * NOTE: This schedule will not be kept tracked if the webpage or mobile app is
 * closed then reopened again at a later time.
 * @param callback - The callback to be scheduled.
 * @param triggerTime - Date and time of when the callback should be invoked.
 * @returns The Schedule instance.
 * @public
 */
export function createScheduledCallback(
  callback: () => void,
  triggerTime: Date
): ScheduledCallback {
  const $factoryObject = createGCFactoryObject()
  let isActive = true
  const timeout = Math.max(0, triggerTime.getTime() - new Date().getTime())
  const timeoutId = setTimeout(() => {
    callback()
    isActive = false
  }, timeout)
  const clear = (): void => {
    clearTimeout(timeoutId)
    isActive = false
  }
  const flush = (): void => {
    clear()
    if (!isActive) {
      callback()
    }
  }
  return {
    ...$factoryObject,
    clear,
    flush,
  }
}
