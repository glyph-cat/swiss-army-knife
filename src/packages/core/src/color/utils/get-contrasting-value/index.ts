import { isString } from '@glyph-cat/type-checking'
import { clamp } from '../../../math'
import { Color } from '../../color'
import { MAX_RGB, MIN_RGB } from '../../constants'

/**
 * @public
 */
export interface PrepareContrastingValueOptions<T> {
  /**
   * Value to return if color is considered 'light'.
   */
  light: T
  /**
   * Value to return if color is considered 'dark'.
   */
  dark: T
  /**
   * A value between `0` to `255`.
   * A color is considered 'dark' once its brightness exceeds this value.
   * @defaultValue `127`
   */
  threshold?: number
}

/**
 * @returns A function that accepts a color and returns the corresponding
 * light/dark values based on the given threshold.
 * @example
 * const getColorForBg = prepareContrastingValue({
 *   light: '#000000',
 *   dark: '#FFFFFF',
 * })
 * getColorForBg('#115522') // '#FFFFFF'
 * getColorForBg('#AACCFF') // '#000000'
 * @example
 * const checkIfBgIsDark = prepareContrastingValue({
 *   light: false,
 *   dark: true,
 * })
 * @public
 */
export function prepareContrastingValue<T>({
  light,
  dark,
  threshold = 127,
}: PrepareContrastingValueOptions<T>): ((bgColor: string) => T) {
  return (color: string | Color): T => {
    if (isString(color)) { color = new Color(color) }
    const clampedThreshold = clamp(threshold, MIN_RGB, MAX_RGB)
    return color.luminance >= clampedThreshold ? light : dark
  }
}

/**
 * @example
 * getContrastingValue('#115522', '#000000', '#FFFFFF') // '#FFFFFF'
 * getContrastingValue('#AACCFF', '#000000', '#FFFFFF') // '#000000'
 * @public
 * @returns The corresponding light/dark values based on the given parameters.
 */
export function getContrastingValue<T>(
  color: string | Color,
  light: T,
  dark: T,
  threshold = 127,
): T {
  if (isString(color)) { color = new Color(color) }
  const clampedThreshold = clamp(threshold, MIN_RGB, MAX_RGB)
  return color.luminance >= clampedThreshold ? light : dark
}
