/**
 * @public
 */
export function AnimationTiming(
  durationInMiliseconds: number
): any { // eslint-disable-line @typescript-eslint/no-explicit-any
  return `${parseFloat((durationInMiliseconds / 1000).toFixed(3))}s`
}

export * from './constants'
