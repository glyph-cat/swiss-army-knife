import { IS_DEBUG_ENV } from '../../constants'
import { devError } from '../../dev'

/**
 * A utility that helps keep track of time by taking into consideration starting
 * and stopping (pausing).
 * @public
 */
export class TimeTracker {

  /**
   * @internal
   */
  private readonly M$values: Array<[startTime: number, endTime: number]> = []

  /**
   * @internal
   */
  private M$isStarted = false

  constructor() {
    this.start = this.start.bind(this)
    this.stop = this.stop.bind(this)
    this.now = this.now.bind(this)
  }

  get isRunning(): boolean { return this.M$isStarted }

  start(): void {
    if (this.M$isStarted) {
      if (IS_DEBUG_ENV) {
        devError(`Attempted to start a ${TimeTracker.name} that has already been started`)
      }
      return // Early exit
    }
    this.M$values.push([performance.now(), null])
    this.M$isStarted = true
  }

  stop(): void {
    if (!this.M$isStarted) {
      if (IS_DEBUG_ENV) {
        devError(`Attempted to stop a ${TimeTracker.name} that has already been stopped`)
      }
      return // Early exit
    }
    const [startTime] = this.M$values[this.M$values.length - 1]
    this.M$values[this.M$values.length - 1] = [startTime, performance.now()]
    this.M$isStarted = false
  }

  now(): number {
    let elapsedTime = 0
    for (const [startTime, endTime] of this.M$values) {
      elapsedTime += (endTime ?? performance.now()) - startTime
    }
    return elapsedTime
  }

}
