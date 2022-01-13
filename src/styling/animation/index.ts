/**
 * @public
 */
export function AnimationTiming(
  durationInMilliseconds: number
): any { // eslint-disable-line @typescript-eslint/no-explicit-any
  return `${parseFloat((durationInMilliseconds / 1000).toFixed(3))}s`
}

export * from './constants'
