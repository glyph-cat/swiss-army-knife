/**
 * @public
 */
export interface Schedule {
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
 * @param callback - The callback to be scheduled.
 * @param triggerTime - Date and time of when the callback should be invoked.
 * @returns The Schedule instance.
 * @public
 */
export function setSchedule(
  callback: () => void,
  triggerTime: Date
): Schedule {
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
    clear,
    flush,
  }
}
