import { NumericValues3 } from '@glyph-cat/foundation'

/**
 * Converts HSL values to RGB values.
 *
 * References:
 * - ✅ https://www.30secondsofcode.org/js/s/rgb-hex-hsl-hsb-color-format-conversion/#hsl-to-rgb
 * - ✅ https://css-tricks.com/converting-color-spaces-in-javascript/#aa-hsl-to-rgb
 * - ❌ https://stackoverflow.com/a/9493060/5810737
 *
 * @param hue - The hue, in degrees, represented by an integer between `0` to `360`.
 * @param saturation - The saturation, in percentage, represented by an integer between `0` to `100`.
 * @param lightness - The lightness, in percentage, represented by an integer between `0` to `100`.
 * @param alpha - This parameter will be ignored, it exists only for type compatibility purposes.
 * @returns A tuple containing 3 numbers (each between `0` to `255`) that represent
 * the `[red, green, blue]` values.
 * @public
 */
export function hslToRgb(
  hue: number,
  saturation: number,
  lightness: number,
  alpha?: number,
): NumericValues3 {
  saturation /= 100
  lightness /= 100
  const k = (n: number) => (n + hue / 30) % 12
  const a = saturation * Math.min(lightness, 1 - lightness)
  const f = (n: number) => lightness - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)))
  return [Math.round(255 * f(0)), Math.round(255 * f(8)), Math.round(255 * f(4))]
}
