import { clamp } from '../../math/clamp'

/**
 * Determine the brightness of a color.
 * @param r - The red value.
 * @param g - The green value.
 * @param b - The blue value.
 * @returns The brightness of a color ranging from 0 to 255.
 * @public
 */
export function getLuma(r: number, g: number, b: number): number {
  return Math.round(0.21 * r + 0.72 * g + 0.07 * b)
}

/**
 * @public
 */
export interface ContrastingValueSpecifications<T> {
  /**
   * Value to return if color is considered 'light'.
   */
  light: T
  /**
   * Value to return if color is considered 'dark'.
   */
  dark: T
  /**
   * A value between 0 - 255.
   * A color is considered 'dark' once its brightness cross this value.
   * @defaultValue `127`
   */
  threshold?: number
}

/**
 * @param lightValue - Color to use if background is light.
 * @param darkValue - Color to use if background is dark.
 * @returns A function that accepts the background color and returns the
 * (supposed) light/dark foreground color.
 * @example
 * const getColorFromBg = createContrastingValue({
 *   light: '#000000',
 *   dark: '#FFFFFF',
 * })
 * getColorFromBg('#115522') // '#FFFFFF'
 * getColorFromBg('#AACCFF') // '#000000'
 * @example
 * const checkIfBgIsDark = createContrastingValue({
 *   light: false,
 *   dark: true,
 * })
 * @public
 */
export function createContrastingValue<T>({
  light: lightValue,
  dark: darkValue,
  threshold = 127,
}: ContrastingValueSpecifications<T>): ((bgColor: string) => T) {
  return (bgColor: string): T => {
    const [r, g, b] = getRGBAFromHexString(bgColor)
    const clampedThreshold = clamp(threshold, 0, 255)
    return getLuma(r, g, b) >= clampedThreshold ? lightValue : darkValue
  }
}

/**
 * @public
 */
export type RGBAtuple = [
  red: number,
  green: number,
  blue: number,
  alpha: number,
]

/**
 * Converts a hex color string into RGBA values.
 * @param color - The color to be converted.
 * @returns An RGBA tuple.
 * @public
 */
export function getRGBAFromHexString(
  color: string
): RGBAtuple {
  let parsedColors: RGBAtuple
  if (color.match(/^#[0-9A-F]{3,4}$/i)) {
    const [r, g, b, a = 'f'] = color.replace('#', '')
    // Format: '#RGB' or '#RGBA'
    parsedColors = [
      /* R */ parseInt(`${r}${r}`, 16),
      /* G */ parseInt(`${g}${g}`, 16),
      /* B */ parseInt(`${b}${b}`, 16),
      /* A */ parseInt(`${a}${a}`, 16) / 255,
    ]
  } else if (color.match(/^#[0-9A-F]{6,8}$/i)) {
    // Format: '#RRGGBB' or '#RRGGBBAA'
    const [r1, r2, g1, g2, b1, b2, a1 = 'f', a2 = 'f'] = color.replace('#', '')
    parsedColors = [
      /* R */ parseInt(`${r1}${r2}`, 16),
      /* G */ parseInt(`${g1}${g2}`, 16),
      /* B */ parseInt(`${b1}${b2}`, 16),
      /* A */ parseInt(`${a1}${a2}`, 16) / 255,
    ]
  }
  for (let i = 0; i < COLOR_NAMES.length; i++) {
    if (parsedColors[i] < 0 || parsedColors[i] > 255) {
      throw new Error(
        `Invalid color '${color}'. Expected ${COLOR_NAMES[i]} to be between ` +
        `0 to 255 but got ${parsedColors[i]}.`
      )
    }
  }
  return parsedColors
}

const COLOR_NAMES = ['red', 'green', 'blue', 'alpha']
