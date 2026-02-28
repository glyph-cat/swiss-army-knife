import { NumericValues3 } from '@glyph-cat/foundation'
import { MAX_HUE, MAX_LIGHTNESS, MAX_RGB, MAX_SATURATION } from '../../constants'

/**
 * Converts RGB values to HSL values.
 * @param red - The red value represented by an integer between `0` to `255`.
 * @param green - The green value represented by an integer between `0` to `255`.
 * @param blue - The blue value represented by an integer between `0` to `255`.
 * @param alpha - This parameter will be ignored, it exists only for type compatibility purposes.
 * @returns A tuple containing 3 numbers that represent the `[hue, saturation, lightness]`
 * where hue is an integer between `0` to `360`, and saturation and lightness
 * are each integers between `0` to `100`.
 * @public
 */
export function rgbToHsl(
  red: number,
  green: number,
  blue: number,
  alpha?: number,
): NumericValues3 {
  // Reference: https://www.niwa.nu/2013/05/math-behind-colorspace-conversions-rgb-hsl
  const r = red / MAX_RGB
  const g = green / MAX_RGB
  const b = blue / MAX_RGB
  const maxRGB = Math.max(r, g, b)
  const minRGB = Math.min(r, g, b)
  const lightness = (maxRGB + minRGB) / 2
  const maxMinRGBDiff = maxRGB - minRGB
  const saturation = maxRGB === minRGB ? 0 : (
    lightness <= 0.5
      ? maxMinRGBDiff / (maxRGB + minRGB)
      : maxMinRGBDiff / (2 - maxRGB - minRGB)
  )
  const normalizedMaxMinRGBDiff = maxMinRGBDiff === 0 ? 1 : maxMinRGBDiff
  const hue = r === maxRGB
    ? (g - b) / normalizedMaxMinRGBDiff
    : g === maxRGB
      ? 2 + (b - r) / normalizedMaxMinRGBDiff
      : 4 + (r - g) / normalizedMaxMinRGBDiff
  // KIV: '#ff2b80' - Expected hue value to be equal to or between 0 and 360 but got: `21576`
  // Seems to be resolved with `% 360`
  return [
    Math.round(((hue < 0 ? hue + MAX_HUE : hue) * 60) % 360),
    Math.round(saturation * MAX_SATURATION),
    Math.round(lightness * MAX_LIGHTNESS),
  ]
}
