import { clampedPush } from '../../data/array/clamp'
import { devError } from '../../dev'
import { clamp, withMinimumLimit } from '../../math/clamp'

/**
 * @public
 */
export interface TimeEstimator {
  /**
   * Insert a snapshot of the current progress.
   * @param progress - The current progress in percentage. Value must be between
   * `0` and `100`.
   */
  mark(progress: number): void
  /**
   * Get the time estimation in milliseconds.
   * @returns
   * - The time estimation in milliseconds under ordinary circumstances,
   * - or `Infinity` if:
   *   - there are not enough snapshots yet,
   *   - all snapshots in memory have the same progress value, since this
   *     theoritically means it will take forever to complete.
   */
  getEstimation(): number
}

/**
 * @public
 */
export const MINIMUM_TIME_ESTIMATOR_CACHE_SIZE = 2

/**
 * A utility for estimating the remaining time for an action.
 * @param cacheSize Number of snapshots to store. (Default: `2`)
 * @returns A `TimeEstimator` object.
 * @example
 * @public
 */
export function createTimeEstimator(
  cacheSize = MINIMUM_TIME_ESTIMATOR_CACHE_SIZE,
): TimeEstimator {

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
  cacheSize = withMinimumLimit(cacheSize, MINIMUM_TIME_ESTIMATOR_CACHE_SIZE)

  let snapshotStack: Array<[progress: number, timeStamp: number]> = []
  let alreadyCompleted = false
  const MIN_PROGRESS = 0
  const MAX_PROGRESS = 100

  const mark = (progress: number): void => {
    if (progress === MAX_PROGRESS) {
      alreadyCompleted = true
      return // Early exit
    }
    snapshotStack = clampedPush(cacheSize, [[
      clamp(progress, MIN_PROGRESS, MAX_PROGRESS),
      Date.now() // TESTSAFE_getDateNow(),
    ]], snapshotStack)
  }

  const getEstimation = (): number => {
    if (alreadyCompleted) {
      return 0 // Early exit
    }
    if (snapshotStack.length < MINIMUM_TIME_ESTIMATOR_CACHE_SIZE) {
      return Infinity // Early exit
    }
    let summedProgressRatePerMs = 0
    for (let i = 1; i < snapshotStack.length; i++) {
      const [previousProgress, previousTimestamp] = snapshotStack[i - 1]
      const [currentProgress, currentTimestamp] = snapshotStack[i]
      const progressDiff = currentProgress - previousProgress
      const timeDiffInMs = currentTimestamp - previousTimestamp
      // KIV
      // const timeDiffInMs = withMinimumLimit(currentTimestamp - previousTimestamp, 1)
      // // ^ Force minimum value of `timeDiff` to be `1`.
      const progressRatePerMs = progressDiff / timeDiffInMs
      summedProgressRatePerMs += progressRatePerMs
    }
    const averageProgressPerMs = summedProgressRatePerMs / (snapshotStack.length - 1)
    // ^ Must be `snapshotStack.length - 1` because we are calculating the differences
    // ^ Take note: Loop above is written `for (let i = 1; ...`

    if (averageProgressPerMs <= 0) { return Infinity } // Early exit

    const [latestProgress] = snapshotStack[snapshotStack.length - 1]
    const remainingProgess = MAX_PROGRESS - latestProgress
    // Formula:
    // rate = progress / time
    // time = progress / rate
    const estimatedRemainingTimeInMs = remainingProgess / averageProgressPerMs
    return Math.round(estimatedRemainingTimeInMs)
  }

  return {
    mark,
    getEstimation,
  }

}
