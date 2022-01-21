/* eslint-disable */
// File not ready
import { JSFunction } from '../../types'
import { createDelay } from '../delay'

export interface LongPollingInterval {
  start(): Promise<void>
  stop(): void
}

export function createLongPollingInterval(
  callback: JSFunction,
  interval: number
): LongPollingInterval {
  let shouldRun = true
  const delay = createDelay(interval)
  const start = async () => {
    while (shouldRun) {
      await callback()
      // await delay
    }
  }
  const stop = () => {
    shouldRun = false
  }
  return {
    start,
    stop,
  }
}
