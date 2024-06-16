import { useEffect, useState } from 'react'
import { isNumber } from '../../../data'

/**
 * React hook to get current {@link Date} and refreshed at regular intervals.
 * @param refreshInterval - The interval at which the current {@link Date}
 * is refreshed.
 * @returns The current {@link Date}.
 * @public
 */
export function useCurrentDate(refreshInterval?: number): Date {
  const [currentDate, setCurrentDate] = useState<Date>(new Date())
  useEffect(() => {
    if (isNumber(refreshInterval)) {
      const intervalRef = setInterval(() => {
        setCurrentDate(new Date())
      }, refreshInterval)
      return () => { clearInterval(intervalRef) }
    }
  }, [refreshInterval])
  return currentDate
}
