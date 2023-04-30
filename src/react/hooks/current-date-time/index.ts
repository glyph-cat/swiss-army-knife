import { DateTime } from 'luxon'
import { useEffect, useState } from 'react'
import { isNumber } from '../../../data'

/**
 * React hook to get current {@link DateTime} and refreshed at regular intervals.
 * @param refreshInterval - The interval at which the current {@link DateTime}
 * is refreshed.
 * @returns The current {@link DateTime}.
 * @public
 */
export function useCurrentDateTime(refreshInterval?: number): DateTime {
  const [currentDateTime, setCurrentDateTime] = useState<DateTime>(DateTime.now)
  useEffect(() => {
    if (isNumber(refreshInterval)) {
      const intervalRef = setInterval(() => {
        setCurrentDateTime(DateTime.now())
      }, refreshInterval)
      return () => { clearInterval(intervalRef) }
    }
  }, [refreshInterval])
  return currentDateTime
}
