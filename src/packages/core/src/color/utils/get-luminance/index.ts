/**
 * Determine the perceived brightness of a color.
 * @param red - The red value represented either by an integer between `0` to `255`
 * or a decimal between `0.0` to `1.0`, but this must be consistent across
 * all three parameters.
 * @param green - The green value represented either by an integer between `0` to `255`
 * or a decimal between `0.0` to `1.0`, but this must be consistent across
 * all three parameters.
 * @param blue - The blue value represented either by an integer between `0` to `255`
 * or a decimal between `0.0` to `1.0`, but this must be consistent across
 * all three parameters.
 * @param alpha - This parameter will be ignored, it exists only for type compatibility purposes.
 * @returns An integer representing the luminance between `0` to `100`.
 * @public
 */
export function getLuminance(
  red: number,
  green: number,
  blue: number,
  alpha?: number,
): number {
  return 0.21 * red + 0.72 * green + 0.07 * blue
}
