import { isNumber } from '@glyph-cat/type-checking'
import { useEffect, useState } from 'react'

/**
 * React hook to get current date and refreshed at regular intervals.
 * @param refreshInterval - The interval at which the current date.
 * is refreshed.
 * @returns The current [`Date`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Date).
 * @public
 */
export function useCurrentDate(refreshInterval?: number): Date {
  const [currentDate, setCurrentDate] = useState<Date>(() => new Date())
  useEffect(() => {
    if (!isNumber(refreshInterval)) { return }
    const intervalRef = setInterval(() => {
      setCurrentDate(new Date())
    }, refreshInterval)
    return () => { clearInterval(intervalRef) }
  }, [refreshInterval])
  return currentDate
}
