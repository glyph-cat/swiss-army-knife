import { clampedPush } from '../../data/array/clamp'
import { devError } from '../../dev'
import { clamp } from '../../math/clamp'

/**
 * @internal
 */
const MIN_PROGRESS = 0

/**
 * @internal
 */
const MAX_PROGRESS = 100

/**
 * @public
 */
export const MINIMUM_TIME_ESTIMATOR_CACHE_SIZE = 2

/**
 * A utility for estimating the remaining time for an action.
 * @public
 */
export class TimeEstimator {

  private M$snapshotStack: Array<[progress: number, timeStamp: number]> = []
  private M$alreadyCompleted = false

  /**
   * @param cacheSize - Number of snapshots to store. (Default: `2`)
   * @example
   * const myTimeEstimator = new TimeEstimator()
   */
  constructor(private readonly cacheSize: number = MINIMUM_TIME_ESTIMATOR_CACHE_SIZE) {
    // Error is not thrown because this is just a time estimation utility.
    // Even with a decent cache size, the estimation might still be wrong.
    // It makes more sense to throw an error only when we rather prefer the
    // application to stop working than to display wrong information.
    if (cacheSize < MINIMUM_TIME_ESTIMATOR_CACHE_SIZE) {
      devError(
        `Expected \`cacheSize\` to be at least ${MINIMUM_TIME_ESTIMATOR_CACHE_SIZE}` +
        `but got ${cacheSize}. Automatically setting to ${MINIMUM_TIME_ESTIMATOR_CACHE_SIZE}.`
      )
    }
    this.cacheSize = Math.max(cacheSize, MINIMUM_TIME_ESTIMATOR_CACHE_SIZE)
  }

  /**
   * Insert a snapshot of the current progress.
   * @param progress - The current progress in percentage. Value must be between
   * `0` and `100`.
   */
  mark(progress: number): void {
    if (progress === MAX_PROGRESS) {
      this.M$alreadyCompleted = true
      return // Early exit
    }
    this.M$snapshotStack = clampedPush(this.cacheSize, [[
      clamp(progress, MIN_PROGRESS, MAX_PROGRESS),
      Date.now() // TESTSAFE_getDateNow(),
    ]], this.M$snapshotStack)
  }

  /**
   * Get the time estimation in milliseconds.
   * @returns
   * - The time estimation in milliseconds under ordinary circumstances,
   * - or `Infinity` if:
   *   - there are not enough snapshots yet,
   *   - all snapshots in memory have the same progress value, since this
   *     theoritically means it will take forever to complete.
   */
  getEstimation(): number {
    if (this.M$alreadyCompleted) {
      return 0 // Early exit
    }
    if (this.M$snapshotStack.length < MINIMUM_TIME_ESTIMATOR_CACHE_SIZE) {
      return Infinity // Early exit
    }
    let summedProgressRatePerMs = 0
    for (let i = 1; i < this.M$snapshotStack.length; i++) {
      const [previousProgress, previousTimestamp] = this.M$snapshotStack[i - 1]
      const [currentProgress, currentTimestamp] = this.M$snapshotStack[i]
      const progressDiff = currentProgress - previousProgress
      const timeDiffInMs = currentTimestamp - previousTimestamp
      // KIV
      // const timeDiffInMs = withMinimumLimit(currentTimestamp - previousTimestamp, 1)
      // // ^ Force minimum value of `timeDiff` to be `1`.
      const progressRatePerMs = progressDiff / timeDiffInMs
      summedProgressRatePerMs += progressRatePerMs
    }
    const averageProgressPerMs = summedProgressRatePerMs / (this.M$snapshotStack.length - 1)
    // ^ Must be `snapshotStack.length - 1` because we are calculating the differences
    // ^ Take note: Loop above is written `for (let i = 1; ...`

    if (averageProgressPerMs <= 0) { return Infinity } // Early exit

    const [latestProgress] = this.M$snapshotStack[this.M$snapshotStack.length - 1]
    const remainingProgess = MAX_PROGRESS - latestProgress
    // Formula:
    // rate = progress / time
    // time = progress / rate
    const estimatedRemainingTimeInMs = remainingProgess / averageProgressPerMs
    return Math.round(estimatedRemainingTimeInMs)
  }

  /**
   * Clears all snapshots in the cache.
   */
  reset(): void {
    this.M$alreadyCompleted = false
    this.M$snapshotStack = []
  }

}
