// #region Imports
import { IS_CLIENT_ENV } from '../constants'
import {
  hasProperty,
  isNull,
  isNullOrUndefined,
  isNumber,
  isObject,
  isString,
  Nullable,
  trySerialize
} from '../data'
import { devError } from '../dev'
import { clamp, NumericDataSet } from '../math'
import { isOutOfRange } from '../math/range'
import { LenientString, NumericValues3 } from '../types'
import {
  ColorFormat,
  ContrastingValueSpecifications,
  CSSColor,
  SerializedColor,
  SerializedHSL,
  SerializedRGB,
  ToStringOptions,
  WithAlphaAsOptional,
} from './abstractions'
import { LOOKUP_DICTIONARY } from './lookup'
import {
  getValuesFromHexString,
  getValuesFromHSLString,
  getValuesFromRGBString,
  showErrorIfInvalid,
} from './util'
// #endregion Imports

// This helps to reduce chances of typo and bundle size
const RED = 'red'
const GREEN = 'green'
const BLUE = 'blue'
const ALPHA = 'alpha'
const HUE = 'hue'
const SATURATION = 'saturation'
const LIGHTNESS = 'lightness'
// const LUMINANCE = 'luminance'

// todo: what do these parameters stand for?
function hueToRgb(p, q, t) {
  if (t < 0) t += 1
  if (t > 1) t -= 1
  if (t < 1 / 6) return p + (q - p) * 6 * t
  if (t < 1 / 2) return q
  if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6
  return p
}

// #region ColorUtil

/**
 * @public
 */
export namespace ColorUtil {

  /**
   * Converts HSL values to RGB values.
   * @param hue - The hue, in degrees, represented by an integer between `0` to `360`.
   * @param saturation - The saturation, in percentage, represented by an integer between `0` to `100`.
   * @param lightness - The lightness, in percentage, represented by an integer between `0` to `100`.
   * @returns A tuple containing 3 numbers (each between `0` to `255`) that represent
   * the `[red, green, blue]` values.
   * @public
   */
  export function fromHSLToRGB(
    hue: number,
    saturation: number,
    lightness: number
  ): NumericValues3 {
    // Reference: https://stackoverflow.com/a/9493060/5810737
    let r: number, g: number, b: number
    if (saturation === 0) {
      r = g = b = lightness
    } else {
      const q = lightness < 0.5
        ? lightness * (1 + saturation)
        : lightness + saturation - lightness * saturation
      const p = 2 * lightness - q
      r = hueToRgb(p, q, hue + 1 / 3)
      g = hueToRgb(p, q, hue)
      b = hueToRgb(p, q, hue - 1 / 3)
    }
    return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)]
  }

  /**
   * Converts RGB values to HSL values.
   * @param red - The red value represented by an integer between `0` to `255`.
   * @param green - The green value represented by an integer between `0` to `255`.
   * @param blue - The blue value represented by an integer between `0` to `255`.
   * @returns A tuple containing 3 numbers that represent the `[hue, saturation, lightness]`
   * where hue is an integer between `0` to `360`, and saturation and lightness
   * are each integers between `0` to `100`.
   * @public
   */
  export function fromRGBToHSL(red: number, green: number, blue: number): NumericValues3 {
    // Reference: https://www.niwa.nu/2013/05/math-behind-colorspace-conversions-rgb-hsl
    const r = red / Color.MAX_RGB_VALUE
    const g = green / Color.MAX_RGB_VALUE
    const b = blue / Color.MAX_RGB_VALUE
    const maxRGB = Math.max(r, g, b)
    const minRGB = Math.min(r, g, b)
    const lightness = new NumericDataSet([maxRGB, minRGB]).mean
    const maxMinRGBDiff = maxRGB - minRGB
    const saturation = maxRGB === minRGB ? 0 : (
      lightness <= 0.5
        ? maxMinRGBDiff / (maxRGB + minRGB)
        : maxMinRGBDiff / (2 - maxRGB - minRGB)
    )
    const hue = r === maxRGB
      ? (g - b) / maxMinRGBDiff
      : g === maxRGB
        ? 2 + (b - r) / maxMinRGBDiff
        : 4 + (r - g) / maxMinRGBDiff
    return [
      Math.round((hue < 0 ? hue + Color.MAX_HUE_VALUE : hue) * 60),
      Math.round(saturation * Color.MAX_SATURATION_VALUE),
      Math.round(lightness * Color.MAX_LIGHTNESS_VALUE),
    ]
  }

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
   * @returns An integer representing the luminance between `0` to `100`.
   * @public
   */
  export function getLuminance(red: number, green: number, blue: number): number {
    return 0.21 * red + 0.72 * green + 0.07 * blue
  }

  /**
   * @returns A function that accepts a color and returns the corresponding
   * light or dark values based on the threshold set.
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
    return (color: string | Color): T => {
      if (isString(color)) { color = Color.fromString(color) }
      const clampedThreshold = clamp(threshold, Color.MIN_RGB_VALUE, Color.MAX_RGB_VALUE)
      return color.luminance >= clampedThreshold ? lightValue : darkValue
    }
  }

}

// #endregion ColorUtil

type InternalValues = Omit<Record<keyof SerializedColor, number>, 'luminance'>

/**
 * @public
 */
export class Color {

  // #region Public constants
  static readonly MIN_ALPHA_VALUE = 0
  static readonly MAX_ALPHA_VALUE = 1
  static readonly MIN_RGB_VALUE = 0
  static readonly MAX_RGB_VALUE = 255
  static readonly MIN_HUE_VALUE = 0
  static readonly MAX_HUE_VALUE = 360
  static readonly MIN_SATURATION_VALUE = 0
  static readonly MAX_SATURATION_VALUE = 100
  static readonly MIN_LIGHTNESS_VALUE = 0
  static readonly MAX_LIGHTNESS_VALUE = 100
  // #endregion Public constants

  /**
   * @internal
   */
  private static readonly M$DEFAULT_INTERNAL_VALUES: InternalValues = {
    red: null,
    green: null,
    blue: null,
    alpha: Color.MAX_ALPHA_VALUE,
    hue: null,
    saturation: null,
    lightness: null,
  }

  // #region .fromRGB

  /**
   * Creates a {@link Color} from a string that represents a color in RGB format.
   * @param value - A case-insensitive string representing the color.
   * Leading and trailing spaces are not allowed.
   * @returns A {@link Color} instance with the given values.
   * @see https://developer.mozilla.org/en-US/docs/Web/CSS/color_value/rgb
   * @example
   * Color.fromRGB('rgb(255, 0, 0)')
   */
  static fromRGB(string: string): Color

  /**
   * Creates a {@link Color} from a JavaScript object that contains the RGB values of a color.
   * @param value - The JavaScript object representing the color.
   * @returns A {@link Color} instance with the given values.
   * @example
   * Color.fromRGB({ red: 255, blue: 0, green: 0 })
   */
  static fromRGB(json: WithAlphaAsOptional<SerializedRGB>): Color

  /**
   * Creates a {@link Color} from the given RGB values.
   * @param red - The red value represented by an integer between `0` to `255`.
   * @param green - The green value represented by an integer between `0` to `255`.
   * @param blue - The blue value represented by an integer between `0` to `255`.
   * @param alpha - The alpha value represented by a decimal between `0.0` to `1.0`.
   * @returns A {@link Color} instance with the given values.
   * @example
   * Color.fromRGB(255, 0, 0)
   */
  static fromRGB(red: number, green: number, blue: number, alpha?: number): Color

  /**
   * @internal
   */
  static fromRGB(
    firstArg: WithAlphaAsOptional<SerializedRGB> | number | string,
    green?: number,
    blue?: number,
    alpha?: number
  ): Color {
    if (isNumber(firstArg)) {
      return Color.fromRGBValues(firstArg, green, blue, alpha)
    } else if (isString(firstArg)) {
      return Color.fromRGBString(firstArg)
    } else if (isObject(firstArg)) {
      return Color.fromRGBObject(firstArg)
    }
    if (IS_CLIENT_ENV) {
      devError([
        'Invalid RGB parameter.',
        '',
        'Usage:',
        ` - Values, example: ${Color.fromRGB.name}(255, 255, 255)`,
        ` - String, example: ${Color.fromRGB.name}('rgb(255,255,255)')`,
        ` - Object, example: ${Color.fromRGB.name}({ red: 255, green: 255, blue: 255 })`,
      ].join('\n'))
    }
    throw new Error('Invalid RGB parameter')
  }

  /**
   * Creates a {@link Color} from a string that represents a color in RGB format.
   * @param value - A case-insensitive string representing the color.
   * Leading and trailing spaces are not allowed.
   * @returns A {@link Color} instance with the given values.
   * @see https://developer.mozilla.org/en-US/docs/Web/CSS/color_value/rgb
   * @example
   * Color.fromRGB('rgb(255, 0, 0)')
   */
  static fromRGBString(value: string): Color {
    const [
      red, redRaw,
      green, greenRaw,
      blue, blueRaw,
      alpha, alphaRaw,
    ] = getValuesFromRGBString(value)
    showErrorIfInvalid(RED, ...VALIDATION_RANGES.red, red, redRaw)
    showErrorIfInvalid(GREEN, ...VALIDATION_RANGES.green, green, greenRaw)
    showErrorIfInvalid(BLUE, ...VALIDATION_RANGES.blue, blue, blueRaw)
    if (alphaRaw) { showErrorIfInvalid(ALPHA, ...VALIDATION_RANGES.alpha, alpha, alphaRaw) }
    const color = new Color()
    color.M$internalValues = {
      ...color.M$internalValues,
      red,
      green,
      blue,
      ...(isNullOrUndefined(alphaRaw) ? {} : { alpha }),
    }
    return color
  }

  /**
   * Creates a {@link Color} from a JavaScript object that contains the RGB values of a color.
   * @param value - The JavaScript object representing the color.
   * @returns A {@link Color} instance with the given values.
   * @example
   * Color.fromRGBObject({ red: 255, blue: 0, green: 0 })
   */
  static fromRGBObject(value: WithAlphaAsOptional<SerializedRGB>): Color {
    const { red, green, blue, alpha } = value
    return Color.fromRGBValues(red, green, blue, alpha)
  }


  /**
   * Creates a {@link Color} from the given RGB values.
   * @param red - The red value represented by an integer between `0` to `255`.
   * @param green - The green value represented by an integer between `0` to `255`.
   * @param blue - The blue value represented by an integer between `0` to `255`.
   * @param alpha - The alpha value represented by a decimal between `0.0` to `1.0`.
   * @returns A {@link Color} instance with the given values.
   * @example
   * Color.fromRGBValues(255, 0, 0)
   */
  static fromRGBValues(red: number, green: number, blue: number, alpha?: number): Color {
    showErrorIfInvalid(RED, ...VALIDATION_RANGES.red, red, red)
    showErrorIfInvalid(GREEN, ...VALIDATION_RANGES.green, green, green)
    showErrorIfInvalid(BLUE, ...VALIDATION_RANGES.blue, blue, blue)
    if (alpha) { showErrorIfInvalid(ALPHA, ...VALIDATION_RANGES.alpha, alpha, alpha) }
    const color = new Color()
    color.M$internalValues = {
      ...color.M$internalValues,
      red,
      green,
      blue,
      ...(isNullOrUndefined(alpha) ? {} : { alpha }),
    }
    return color
  }

  // #endregion .fromRGB

  // #region .fromHSL

  /**
   * Creates a {@link Color} from a string that represents a color in HSL format.
   * @param value - A case-insensitive string representing the color.
   * Leading and trailing spaces are not allowed.
   * @returns A {@link Color} instance with the given values.
   * @see https://developer.mozilla.org/en-US/docs/Web/CSS/color_value/hsl
   * @example
   * Color.fromHSL('hsl(0, 100%, 50%)')
   */
  static fromHSL(string: string): Color

  /**
   * Creates a {@link Color} from a JavaScript object that contains the HSL values of a color.
   * @param value - The JavaScript object representing the color.
   * @returns A {@link Color} instance with the given values.
   * @example
   * Color.fromHSL({ hue: 0, saturation: 100, lightness: 50 })
   */
  static fromHSL(json: WithAlphaAsOptional<SerializedHSL>): Color

  /**
   * Creates a {@link Color} from the given HSL values.
   * @param hue - The hue, in degrees, represented by an integer between `0` to `360`.
   * @param saturation - The saturation, in percentage, represented by an integer between `0` to `100`.
   * @param lightness - The lightness, in percentage, represented by an integer between `0` to `100`.
   * @param alpha - The alpha value represented by a decimal between `0.0` to `1.0`.
   * @returns A {@link Color} instance with the given values.
   * @example
   * Color.fromHSL(0, 100, 50)
   */
  static fromHSL(hue: number, saturation: number, lightness: number, alpha?: number): Color

  /**
   * @internal
   */
  static fromHSL(
    firstArg: WithAlphaAsOptional<SerializedHSL> | number | string,
    hue?: number,
    saturation?: number,
    lightness?: number
  ): Color {
    if (isNumber(firstArg)) {
      return Color.fromHSLValues(firstArg, hue, saturation, lightness)
    } else if (isString(firstArg)) {
      return Color.fromHSLString(firstArg)
    } else if (isObject(firstArg)) {
      return Color.fromHSLObject(firstArg)
    }
    if (IS_CLIENT_ENV) {
      devError([
        'Invalid HSL parameter.',
        '',
        'Usage:',
        ` - Values, example: ${Color.fromHSL.name}(255, 100, 100)`,
        ` - String, example: ${Color.fromHSL.name}('hsl(0,100%,100%)')`,
        ` - Object, example: ${Color.fromHSL.name}({ hue: 255, saturation: 100, lightness: 100 })`,
      ].join('\n'))
    }
    throw new Error('Invalid HSL parameter')
  }

  /**
   * Creates a {@link Color} from a string that represents a color in HSL format.
   * @param value - A case-insensitive string representing the color.
   * Leading and trailing spaces are not allowed.
   * @returns A {@link Color} instance with the given values.
   * @see https://developer.mozilla.org/en-US/docs/Web/CSS/color_value/hsl
   * @example
   * Color.fromHSLString('hsl(0, 100%, 50%)')
   */
  static fromHSLString(value: string): Color {
    const [
      hue, hueRaw,
      saturation, saturationRaw,
      lightness, lightnessRaw,
      alpha, alphaRaw,
    ] = getValuesFromHSLString(value)
    showErrorIfInvalid(HUE, ...VALIDATION_RANGES.hue, hue, hueRaw)
    showErrorIfInvalid(SATURATION, ...VALIDATION_RANGES.saturation, saturation, saturationRaw)
    showErrorIfInvalid(LIGHTNESS, ...VALIDATION_RANGES.lightness, lightness, lightnessRaw)
    if (alphaRaw) { showErrorIfInvalid(ALPHA, ...VALIDATION_RANGES.alpha, alpha, alphaRaw) }
    const color = new Color()
    color.M$internalValues = {
      ...color.M$internalValues,
      hue,
      saturation,
      lightness,
      ...(isNullOrUndefined(alphaRaw) ? {} : { alpha }),
    }
    return color
  }

  /**
   * Creates a {@link Color} from a JavaScript object that contains the HSL values of a color.
   * @param value - The JavaScript object representing the color.
   * @returns A {@link Color} instance with the given values.
   * @example
   * Color.fromHSLObject({ hue: 0, saturation: 100, lightness: 50 })
   */
  static fromHSLObject(value: WithAlphaAsOptional<SerializedHSL>): Color {
    const { hue, saturation, lightness, alpha } = value
    return Color.fromHSLValues(hue, saturation, lightness, alpha)
  }

  /**
   * Creates a {@link Color} from the given HSL values.
   * @param hue - The hue, in degrees, represented by an integer between `0` to `360`.
   * @param saturation - The saturation, in percentage, represented by an integer between `0` to `100`.
   * @param lightness - The lightness, in percentage, represented by an integer between `0` to `100`.
   * @param alpha - The alpha value represented by a decimal between `0.0` to `1.0`.
   * @returns A {@link Color} instance with the given values.
   * @example
   * Color.fromHSLValues(0, 100, 50)
   */
  static fromHSLValues(
    hue: number,
    saturation: number,
    lightness: number,
    alpha?: number
  ): Color {
    showErrorIfInvalid(HUE, ...VALIDATION_RANGES.hue, hue, hue)
    showErrorIfInvalid(SATURATION, ...VALIDATION_RANGES.saturation, saturation, saturation)
    showErrorIfInvalid(LIGHTNESS, ...VALIDATION_RANGES.lightness, lightness, lightness)
    if (alpha) { showErrorIfInvalid(ALPHA, ...VALIDATION_RANGES.alpha, alpha, alpha) }
    const color = new Color()
    color.M$internalValues = {
      ...color.M$internalValues,
      hue,
      saturation,
      lightness,
      ...(isNullOrUndefined(alpha) ? {} : { alpha }),
    }
    return color
  }

  // #endregion .fromHSL

  // #region .fromString

  /**
   * Creates a {@link Color} from a string that represents a color in hex format.
   * @param value - A hex formatted string (not case-sensitive).
   * @returns A {@link Color} instance with the given values.
   * @example
   * Color.fromHex('#ff0000)
   */
  static fromHex(value: string): Color {
    const [
      red, redRaw,
      green, greenRaw,
      blue, blueRaw,
      alpha, alphaRaw,
    ] = getValuesFromHexString(value)
    showErrorIfInvalid(RED, ...VALIDATION_RANGES.red, red, redRaw)
    showErrorIfInvalid(GREEN, ...VALIDATION_RANGES.green, green, greenRaw)
    showErrorIfInvalid(BLUE, ...VALIDATION_RANGES.blue, blue, blueRaw)
    if (alphaRaw) { showErrorIfInvalid('alpha', ...VALIDATION_RANGES.alpha, alpha, alphaRaw) }
    const color = new Color()
    color.M$internalValues = {
      ...color.M$internalValues,
      red,
      green,
      blue,
      ...(isNullOrUndefined(alphaRaw) ? {} : { alpha }),
    }
    return color
  }

  /**
   * Creates a {@link Color} from a string that represents a color either in hex/rgb/hsl format.
   * @param value - A hex/rgb/hsl formatted string (not case-sensitive).
   * @returns A {@link Color} instance with the given values.
   * @example
   * Color.fromString('#ff0000)
   * Color.fromString('rgb(255, 0, 0)')
   * Color.fromString('hsl(0, 100%, 50%)')
   */
  static fromString(value: string): Color {
    if (/^#/.test(value)) {
      return Color.fromHex(value)
    } else if (/^rgb/i.test(value)) {
      return Color.fromRGBString(value)
    } else if (/^hsl/i.test(value)) {
      return Color.fromHSLString(value)
    } else {
      throw new Error(`Invalid color syntax '${value}'`)
    }
  }

  // #endregion `fromString`

  /**
   * Creates a {@link Color} from a JavaScript object that contains either the
   * RGB or HSL values of a color.
   * @param value - The JavaScript object representing the color.
   * @returns A {@link Color} instance with the given values.
   * @example
   * Color.fromJSON({ red: 255, blue: 0, green: 0 })
   * Color.fromJSON({ hue: 0, saturation: 100, lightness: 50 })
   */
  static fromJSON(
    value: WithAlphaAsOptional<SerializedRGB> | WithAlphaAsOptional<SerializedHSL>
  ): Color {
    // Using `hasProperty` only because all fields are mandatory here
    // can use static `from...` methods here because the values are not processed
    // before being passed to the constructor.
    if (hasProperty(value, RED)) {
      return Color.fromRGBObject(value as WithAlphaAsOptional<SerializedRGB>)
    } else if (hasProperty(value, HUE)) {
      return Color.fromHSLObject(value as WithAlphaAsOptional<SerializedHSL>)
    }
    throw new Error(`Invalid object: ${trySerialize(value)}`)
  }

  // #region Class properties

  /**
   * @internal
   */
  private M$internalValues: InternalValues = { ...Color.M$DEFAULT_INTERNAL_VALUES }

  // #endregion Class properties

  private constructor() {
    // Empty but required for the `private` modifier to be effective
  }

  // #region Getters

  /**
   * A flag indicating whether the color has invalid values.
   */
  get isInvalid(): boolean {
    if (hasProperty(this.M$internalValues, RED)) {
      if (
        isOutOfRange(this.M$internalValues.red, ...VALIDATION_RANGES.red) ||
        isOutOfRange(this.M$internalValues.blue, ...VALIDATION_RANGES.blue) ||
        isOutOfRange(this.M$internalValues.green, ...VALIDATION_RANGES.green)
      ) {
        return true // Early exit
      }
    } else if (hasProperty(this.M$internalValues, HUE)) {
      if (
        isOutOfRange(this.M$internalValues.hue, ...VALIDATION_RANGES.hue) ||
        isOutOfRange(this.M$internalValues.saturation, ...VALIDATION_RANGES.saturation) ||
        isOutOfRange(this.M$internalValues.lightness, ...VALIDATION_RANGES.lightness)
      ) {
        return true // Early exit
      }
    }
    if (isOutOfRange(this.M$internalValues.alpha, ...VALIDATION_RANGES.alpha)) {
      return true // Early exit
    }
    return false
  }

  /**
   * The red value represented by an integer between `0` to `255`.
   */
  get red(): number {
    if (isNull(this.M$internalValues.red)) { this.M$initRGBValues() }
    return this.M$internalValues.red
  }

  /**
   * The green value represented by an integer between `0` to `255`.
   */
  get green(): number {
    if (isNull(this.M$internalValues.green)) { this.M$initRGBValues() }
    return this.M$internalValues.green
  }

  /**
   * The blue value represented by an integer between `0` to `255`.
   */
  get blue(): number {
    if (isNull(this.M$internalValues.blue)) { this.M$initRGBValues() }
    return this.M$internalValues.blue
  }

  /**
   * The alpha value represented by a decimal between `0.0` to `1.0`.
   */
  get alpha(): number {
    return this.M$internalValues.alpha
  }

  /**
   * The hue, in degrees, represented by an integer between `0` to `360`.
   */
  get hue(): number {
    if (isNull(this.M$internalValues.hue)) { this.M$initHSLValues() }
    return this.M$internalValues.hue
  }

  /**
   * The saturation, in percentage, represented by an integer between `0` to `100`.
   */
  get saturation(): number {
    if (isNull(this.M$internalValues.saturation)) { this.M$initHSLValues() }
    return this.M$internalValues.saturation
  }

  /**
   * The lightness, in percentage, represented by an integer between `0` to `100`.
   */
  get lightness(): number {
    if (isNull(this.M$internalValues.lightness)) { this.M$initHSLValues() }
    return this.M$internalValues.lightness
  }

  /**
   * The perceived brightness of the color, in percentage, represented by a number
   * between `0` to `100`.
   */
  get luminance(): number {
    return ColorUtil.getLuminance(this.red, this.green, this.blue)
  }

  // #endregion Getters

  // NOTE: Setters were removed to reduce complexity, since the instance is an
  // immutable representation of a color, it would be more feasible to have a
  // new Color instance created based on the properties from an existing color.
  // That is also why so much consideration has been put into designing the getters.

  // #region Serialization

  /**
   * Serializes the color into a JavaScript object.
   * @returns A plain JavaScript object representing the color.
   */
  toJSON(): SerializedColor {
    return {
      red: this.red,
      green: this.green,
      blue: this.blue,
      alpha: this.alpha,
      hue: this.hue,
      saturation: this.saturation,
      lightness: this.lightness,
      luminance: this.luminance,
    }
  }

  /**
   * Converts the color into a string representation.
   * @param format - The {@link ColorFormat}.
   * @param options - Additional formatting options.
   * @returns A string representation of the color.
   * @example
   * const color = Color.fromString('#00ff00')
   *
   * console.log(color.toString(ColorFormat.RGB))
   * console.log(color.toString(ColorFormat.HSL))
   * console.log(color.toString())
   *
   * // The equivalent of calling `toString` without any parameters:
   * console.log(`The hex color code for green is ${color}`)
   */
  toString(format: ColorFormat = ColorFormat.FFFFFF, options?: ToStringOptions): string {
    if (this.isInvalid) { return '#InvalidColor' } // Early exit
    if (format === ColorFormat.FFFFFF) {
      if (this.alpha === Color.MAX_ALPHA_VALUE) {
        return this.M$getRGBHexString() // Early exit
      } else {
        format = ColorFormat.FFFFFFFF
      }
    }
    if (format === ColorFormat.FFFFFFFF) {
      return this.M$getRGBAHexString() // Early exit
    }
    if (format === ColorFormat.FFF) {
      if (this.alpha === Color.MAX_ALPHA_VALUE) {
        let output: string
        const fullString = this.M$getRGBHexString()
        if (
          fullString[1] === fullString[2] &&
          fullString[3] === fullString[4] &&
          fullString[5] === fullString[6]
        ) {
          output = '#' + fullString[1] + fullString[3] + fullString[5]
        } else {
          output = fullString
        }
        return output // Early exit
      } else {
        format = ColorFormat.FFFF
      }
    }
    if (format === ColorFormat.FFFF) {
      let output: string
      const fullString = this.M$getRGBAHexString()
      if (
        fullString[1] === fullString[2] &&
        fullString[3] === fullString[4] &&
        fullString[5] === fullString[6] &&
        fullString[7] === fullString[8]
      ) {
        output = '#' + fullString[1] + fullString[3] + fullString[5] + fullString[7]
      } else {
        output = fullString
      }
      return output // Early exit
    }
    if (format === ColorFormat.RGB) {
      return this.M$getRGBString(
        this.alpha !== Color.MAX_ALPHA_VALUE ? 1 : 0,
        options?.truncateDecimals
      ) // Early exit
    }
    if (format === ColorFormat.RGBA) {
      return this.M$getRGBString(1, options?.truncateDecimals) // Early exit
    }
    if (format === ColorFormat.HSL) {
      return this.M$getHSLString(
        this.alpha !== Color.MAX_ALPHA_VALUE ? 1 : 0,
        options?.truncateDecimals
      ) // Early exit
    }
    if (format === ColorFormat.HSLA) {
      return this.M$getHSLString(1, options?.truncateDecimals) // Early exit
    }
    throw new Error(`Invalid format '${format}'`)
  }

  /**
   * Shorthand of {@link toString} without any parameters.
   * @returns A string representation of the color.
   */
  valueOf(): string {
    return this.toString()
  }

  // #endregion Serialization

  // #region Private helpers

  /**
   * NOTE: Not private so that they can be accessed from test.
   * @internal
   */
  M$initRGBValues = (): void => {
    const [r, g, b] = ColorUtil.fromHSLToRGB(
      this.M$internalValues.hue,
      this.M$internalValues.saturation,
      this.M$internalValues.lightness,
    )
    // this.M$red = r
    this.M$internalValues.red = r
    this.M$internalValues.green = g
    this.M$internalValues.blue = b
  }

  /**
   * NOTE: Not private so that they can be accessed from test.
   * @internal
   */
  M$initHSLValues = (): void => {
    const [h, s, l] = ColorUtil.fromRGBToHSL(
      this.M$internalValues.red,
      this.M$internalValues.green,
      this.M$internalValues.blue,
    )
    this.M$internalValues.hue = h
    this.M$internalValues.saturation = s
    this.M$internalValues.lightness = l
  }

  /**
   * @internal
   */
  private M$getRGBHexString = (): string => (
    '#' +
    this.red.toString(16).padStart(2, '0') +
    this.green.toString(16).padStart(2, '0') +
    this.blue.toString(16).padStart(2, '0')
  )

  /**
   * @internal
   */
  private M$getRGBAHexString = (): string => (
    this.M$getRGBHexString() +
    this.alpha.toString(16).padStart(2, '0')
  )

  /**
   * @internal
   */
  private M$getRGBString = (showAlpha: 0 | 1, decimalPoints: number): string => {
    const outputStack: Array<number | string> = [
      this.red,
      this.green,
      this.blue,
    ]
    if (showAlpha) {
      outputStack.push(parseFloat(this.alpha.toFixed(decimalPoints)))
    }
    return `rgb(${outputStack.join(', ')})`
  }

  /**
   * @internal
   */
  private M$getHSLString = (showAlpha: 0 | 1, decimalPoints: number): string => {
    // return null // todo
    const outputStack: Array<number | string> = [
      `${this.hue} deg`,
      `${this.saturation} %`,
      `${this.lightness} %`,
    ]
    if (showAlpha) {
      outputStack.push(parseFloat(this.alpha.toFixed(decimalPoints)))
    }
    return `hsl(${outputStack.join(', ')})`
  }

  // #endregion Private helpers

}

const VALIDATION_RANGES: Omit<Record<keyof SerializedColor, [min: number, max: number]>, 'luminance'> = {
  red: [Color.MIN_RGB_VALUE, Color.MAX_RGB_VALUE],
  green: [Color.MIN_RGB_VALUE, Color.MAX_RGB_VALUE],
  blue: [Color.MIN_RGB_VALUE, Color.MAX_RGB_VALUE],
  alpha: [Color.MIN_ALPHA_VALUE, Color.MAX_ALPHA_VALUE],
  hue: [Color.MIN_HUE_VALUE, Color.MAX_HUE_VALUE],
  saturation: [Color.MIN_SATURATION_VALUE, Color.MAX_SATURATION_VALUE],
  lightness: [Color.MIN_RGB_VALUE, Color.MAX_RGB_VALUE],
}

/**
 * @public
 */
export namespace ColorLookup {

  /**
   * Get a {@link Color} from the CSS color name.
   * @param name - Name of the color.
   * @returns A {@link Color} object if it is a valid CSS color name, otherwise `null`.
   * @example
   * ColorLookup.fromCSSName('red')
   * ColorLookup.fromCSSName('blue')
   * ColorLookup.fromCSSName('aquamarine')
   * ColorLookup.fromCSSName('peachpuff')
   * @public
   */
  export function fromCSSName(name: LenientString<CSSColor>): Color {
    name = name.toLowerCase()
    if (LOOKUP_DICTIONARY.value[name]) {
      return Color.fromHex(`#${LOOKUP_DICTIONARY.value[name]}`)
    }
    return null
  }

  /**
   * Get the CSS color name from a color.
   * @param color - A color string or {@link Color} object.
   * @returns A string representing the name of the color if it happens to have a
   * @example
   * const color = Color.fromString('#556b2f')
   * ColorLookup.toCSSName(color) // 'darkolivegreen'
   * ColorLookup.toCSSName('#7fffd4') // 'aquamarine'
   * name, otherwise `null`.
   * @public
   */
  export function toCSSName(color: string | Color): Nullable<CSSColor> {
    let lookupHexCode: string
    if (isString(color)) {
      if (/^#([\da-f]{6,})$/i.test(color)) {
        lookupHexCode = color.replace('#', '').substring(0, 6) // ignore alpha
      } else {
        lookupHexCode = Color.fromString(color).toString(ColorFormat.FFFFFF)
      }
    } else {
      lookupHexCode = color.toString(ColorFormat.FFFFFF)
    }
    return lookupHexCode
      ? LOOKUP_DICTIONARY.value[lookupHexCode.replace('#', '')] as CSSColor ?? null
      : null
  }

}

// #region Exports
export * from './abstractions/public'
// #endregion Exports
