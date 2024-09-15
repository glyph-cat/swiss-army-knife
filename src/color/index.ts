// #region Imports
import { IS_CLIENT_ENV } from '../constants'
import {
  hasEitherProperties,
  hasProperty,
  hasTheseProperties,
  isFunction,
  isNull,
  isNullOrUndefined,
  isNumber,
  isObject,
  isString,
  Nullable,
  omit,
  trySerialize
} from '../data'
import { devError } from '../dev'
import { average, clamp } from '../math'
import { isOutOfRange } from '../math/range'
import { LenientString, NumericValues3 } from '../types'
import {
  ColorFormat,
  ColorModifier,
  ContrastingValueSpecifications,
  CSSColor,
  MultiColorModifier,
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

// todo: add `@throws` to inline docs
// todo: mention in docs that leading/trailing spaces are not allowed for all `fromString...` methods
// todo: include MDN references for syntax in the inline docs, only relative syntax is not supported
// todo: move `src/styling/color` to `src/color`

// This helps to reduce chances typo and bundle size
const RED = 'red'
const GREEN = 'green'
const BLUE = 'blue'
const ALPHA = 'alpha'
const HUE = 'hue'
const SATURATION = 'saturation'
const LIGHTNESS = 'lightness'
const LUMINANCE = 'luminance'

// todo: what do these parameters stand for?
function hueToRgb(p, q, t) {
  if (t < 0) t += 1
  if (t > 1) t -= 1
  if (t < 1 / 6) return p + (q - p) * 6 * t
  if (t < 1 / 2) return q
  if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6
  return p
}

// #region Public utilities

/**
 * @public
 */
export namespace ColorUtil {

  /**
   * Converts HSL values to RGB values.
   * @param hue - The hue value in degrees (between 0 to 360)
   * @param saturation - The saturation value in percentage (between 0 to 100)
   * @param lightness - The lightness value in percentage (between 0 to 100)
   * @returns A tuple containing 3 numbers (each between 0 to 255) that represent
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
   * @param red - The red value in integer form (between 0 to 255)
   * @param green - The green value in integer form (between 0 to 255)
   * @param blue - The blue value in integer form (between 0 to 255)
   * @returns A tuple containing 3 numbers that represent the `[hue, saturation, lightness]`
   * where hue is a number between 0 to 360, saturation is a value between 0 to 100,
   * and lightness is a value between 0 to 100.
   * @public
   */
  export function fromRGBToHSL(red: number, green: number, blue: number): NumericValues3 {
    // Reference: https://www.niwa.nu/2013/05/math-behind-colorspace-conversions-rgb-hsl
    const r = red / Color.MAX_RGB_VALUE
    const g = green / Color.MAX_RGB_VALUE
    const b = blue / Color.MAX_RGB_VALUE
    const maxRGB = Math.max(r, g, b)
    const minRGB = Math.min(r, g, b)
    const lightness = average(maxRGB, minRGB)
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
      (hue < 0 ? hue + Color.MAX_HUE_VALUE : hue) * 60,
      saturation * Color.MAX_SATURATION_VALUE,
      lightness * Color.MAX_LIGHTNESS_VALUE,
    ]
  }

  /**
   * Determine the perceived brightness of a color.
   * @param red - The red value, can be in decimal form (between 0 to 1) or
   * between integer form (between 0 to 255) but must be consistent across all
   * three parameters.
   * @param green - The green value, can be in decimal form (between 0 to 1) or
   * between integer form (between 0 to 255) but must be consistent across all
   * three parameters.
   * @param blue - The blue value, can be in decimal form (between 0 to 1) or
   * between integer form (between 0 to 255) but must be consistent across all
   * three parameters.
   * @returns A number representing the luminance.
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

// #endregion Public utilities

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

  static fromRGB(string: string): Color
  static fromRGB(json: SerializedRGB): Color
  static fromRGB(red: number, green: number, blue: number, alpha?: number): Color

  /**
   * @internal
   */
  static fromRGB(
    firstArg: SerializedRGB | number | string,
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

  static fromRGBObject(value: WithAlphaAsOptional<SerializedRGB>): Color {
    const { red, green, blue, alpha } = value
    return Color.fromRGBValues(red, green, blue, alpha)
  }

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

  // #endregion .fromRGB

  // #region .fromHSL

  static fromHSL(hue: number, saturation: number, lightness: number, alpha?: number): Color
  static fromHSL(string: string): Color
  static fromHSL(json: SerializedHSL): Color

  /**
   * @internal
   */
  static fromHSL(
    firstArg: SerializedHSL | number | string,
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

  static fromHSLObject(value: WithAlphaAsOptional<SerializedHSL>): Color {
    const { hue, saturation, lightness, alpha } = value
    return Color.fromHSLValues(hue, saturation, lightness, alpha)
  }

  /**
   * Parses a HSL color string into a {@link Color}.
   * @param value - A HSL formatted string that is not case-sensitive.
   * @throws An error if the string is not a valid color syntax.
   * @example
   * Color.fromString('hsl(0, 100%, 50%)')
   * @returns A {@link Color} instance.
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

  // #endregion .fromHSL

  // #region .fromString

  /**
   * Parses a hex color string into a {@link Color}.
   * @param value - A hex formatted string that is not case-sensitive.
   * @example
   * Color.fromString('#ff0000)
   * @returns A {@link Color} instance.
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
   * Parses a color string into a {@link Color}.
   * @param value - A hex/rgb/rgba/hsl/hsla formatted string that is not case-sensitive.
   * @throws An error if the string is not a valid color syntax.
   * @example
   * Color.fromString('#ff0000)
   * Color.fromString('rgb(255, 0, 0)')
   * Color.fromString('hsl(0, 100%, 50%)')
   * @returns A {@link Color} instance.
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

  static fromJSON(value: SerializedRGB | SerializedHSL): Color {
    // Using `hasProperty` only because all fields are mandatory here
    // can use static `from...` methods here because the values are not processed
    // before being passed to the constructor.
    if (hasProperty(value, RED)) {
      return Color.fromRGBObject(value as SerializedRGB)
    } else if (hasProperty(value, HUE)) {
      return Color.fromHSLObject(value as SerializedHSL)
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
   * The red value of the color represented by a number between `0` to `255`.
   */
  get red(): number {
    if (isNull(this.M$internalValues.red)) { this.initRGBValues() }
    return this.M$internalValues.red
  }

  /**
   * The green value of the color represented by a number between `0` to `255`.
   */
  get green(): number {
    if (isNull(this.M$internalValues.green)) { this.initRGBValues() }
    return this.M$internalValues.green
  }

  /**
   * The blue value of the color represented by a number between `0` to `255`.
   */
  get blue(): number {
    if (isNull(this.M$internalValues.blue)) { this.initRGBValues() }
    return this.M$internalValues.blue
  }

  /**
   * The alpha value of the color represented by a number between `0.0` to `1.0`.
   */
  get alpha(): number {
    return this.M$internalValues.alpha
  }

  /**
   * The hue value of the color, measured in degrees, represented by a number
   * between `0` to `360`.
   */
  get hue(): number {
    if (isNull(this.M$internalValues.hue)) { this.initHSLValues() }
    return this.M$internalValues.hue
  }

  /**
   * The saturation value of the color represented by a number between `0` to `100`.
   */
  get saturation(): number {
    if (isNull(this.M$internalValues.saturation)) { this.initHSLValues() }
    return this.M$internalValues.saturation
  }

  /**
   * The lightness value of the color represented by a number between `0` to `100`.
   */
  get lightness(): number {
    if (isNull(this.M$internalValues.lightness)) { this.initHSLValues() }
    return this.M$internalValues.lightness
  }

  /**
   * The perceived brightness of the color represented by a number between `0` to `100`.
   */
  get luminance(): number {
    return ColorUtil.getLuminance(this.red, this.green, this.blue)
  }

  // #endregion Getters

  // #region Setters

  setRed(value: number | ColorModifier): Color {
    if (isFunction(value)) { value = value(this.red) }
    showErrorIfInvalid(RED, ...VALIDATION_RANGES.red, value, value)
    return this.M$clone({ red: value })
  }

  setGreen(value: number | ColorModifier): Color {
    if (isFunction(value)) { value = value(this.green) }
    showErrorIfInvalid(GREEN, ...VALIDATION_RANGES.green, value, value)
    return this.M$clone({ green: value })
  }

  setBlue(value: number | ColorModifier): Color {
    if (isFunction(value)) { value = value(this.blue) }
    showErrorIfInvalid(BLUE, ...VALIDATION_RANGES.blue, value, value)
    return this.M$clone({ blue: value })
  }

  setAlpha(value: number | ColorModifier): Color {
    if (isFunction(value)) { value = value(this.alpha) }
    showErrorIfInvalid(ALPHA, ...VALIDATION_RANGES.alpha, value, value)
    return this.M$clone({ alpha: value })
  }

  setHue(value: number | ColorModifier): Color {
    if (isFunction(value)) { value = value(this.hue) }
    showErrorIfInvalid(HUE, ...VALIDATION_RANGES.hue, value, value)
    return this.M$clone({ hue: value })
  }

  setSaturation(value: number | ColorModifier): Color {
    if (isFunction(value)) { value = value(this.saturation) }
    showErrorIfInvalid(SATURATION, ...VALIDATION_RANGES.saturation, value, value)
    return this.M$clone({ saturation: value })
  }

  setLightness(value: number | ColorModifier): Color {
    if (isFunction(value)) { value = value(this.lightness) }
    showErrorIfInvalid(LIGHTNESS, ...VALIDATION_RANGES.lightness, value, value)
    return this.M$clone({ lightness: value })
  }

  set(rgb: Partial<SerializedRGB>): Color

  set(hsl: Partial<SerializedHSL>): Color

  set(modifier: MultiColorModifier): Color

  /**
   * @internal
   */
  set(
    partialValueOrModifier: Partial<SerializedRGB> | Partial<SerializedHSL> | MultiColorModifier
  ): Color {
    // todo: validate & assign new RGB(A)HSL values for each of the methods below
    if (hasEitherProperties(partialValueOrModifier, RED, GREEN, BLUE)) {
      return Color.fromRGBObject({
        red: this.red,
        green: this.green,
        blue: this.blue,
        ...partialValueOrModifier,
      })
    } else if (hasEitherProperties(partialValueOrModifier, HUE, SATURATION, LIGHTNESS)) {
      return Color.fromHSLObject({
        hue: this.hue,
        saturation: this.saturation,
        lightness: this.lightness,
        ...partialValueOrModifier,
      })
    } else if (isFunction(partialValueOrModifier)) {
      const currentValues = omit(this.toJSON(), LUMINANCE)
      return Color.fromJSON(partialValueOrModifier(currentValues))
    }
    devError(`Expected ${Color.name}.set to be called with a function or an object that contains either RGB or HSL values, but got ${isObject(partialValueOrModifier) ? trySerialize(partialValueOrModifier) : typeof partialValueOrModifier}.`)
    throw new Error(`Invalid \`${Color.name}.set\` parameter`)
  }

  // #endregion Setters

  // #region Serialization

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
   * @throws An error when an invalid color format is provided.
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
   * @internal
   */
  private initRGBValues = (): void => {
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
   * @internal
   */
  private initHSLValues = (): void => {
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
  private M$clone = (overrideValues?: Partial<typeof this.M$internalValues>): Color => {
    const newObj = new Color()
    newObj.M$internalValues = {
      ...Color.M$DEFAULT_INTERNAL_VALUES,
      alpha: this.alpha, // Should always be copied
      ...(() => {
        if (hasEitherProperties(overrideValues, 'red', 'green', 'blue')) {
          return {
            red: this.red,
            green: this.green,
            blue: this.blue,
          }
        } else if (hasTheseProperties(overrideValues, 'hue', 'saturation', 'lightness')) {
          return {
            hue: this.hue,
            saturation: this.saturation,
            lightness: this.lightness,
          }
        }
      })(),
    }
    return newObj
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

  // /**
  //  * @deprecated
  //  * - To have one validator for each color field.
  //  * - for RGB need to accommodate [base-10] and [hex]
  //  * - for % values need to handle [%] and [0.1]
  //  * @internal
  //  */
  // private M$validateAndAssign = (
  //   name: keyof SerializedColor,
  //   value: number,
  //   rawValue: number | string,
  // ): this => {
  //   this[`$${name}`] = name !== 'alpha' ? value : (value ?? Color.MAX_ALPHA_VALUE)
  //   const [minValue, maxValue] = validationRanges[name]
  //   this.M$validateBase(name, minValue, maxValue, value, rawValue)
  //   return this
  // }

  // /**
  //  * @internal
  //  */
  // private M$validateBase = (
  //   name: keyof SerializedColor,
  //   minValue: number,
  //   maxValue: number,
  //   value: number,
  //   rawValue: number | string,
  //   // kiv: extra flag to trigger display min/max values in error message in hex???
  // ): void => {
  //   if (value < minValue || value > maxValue) {
  //     devError(`Expected ${name} value to be equal to or between ${minValue} and ${maxValue} but got <${rawValue}>`)
  //     this.M$isInvalid[name] = true
  //   }
  // }

  // /**
  //  * @internal
  //  */
  // private M$validateAndAssignAlpha = (
  //   value: number,
  //   rawValue: number | string,
  // ): this => {
  //   if (rawValue && isString(rawValue)) {
  //     value = /%/.test(rawValue) ? (value / 100) : value
  //   } else {
  //     value = Color.MAX_ALPHA_VALUE
  //   }
  //   this.M$validateBase(
  //     'alpha',
  //     Color.MIN_ALPHA_VALUE,
  //     Color.MAX_ALPHA_VALUE,
  //     value,
  //     rawValue,
  //   )
  //   this.M$internalValues.alpha = value
  //   return this
  // }

  // /**
  //  * @internal
  //  */
  // private M$validateAndAssignRGB = (
  //   name: 'red' | 'green' | 'blue',
  //   value: number,
  //   rawValue: number | string,
  // ): this => {
  //   this.M$validateBase(name, Color.MIN_RGB_VALUE, Color.MAX_RGB_VALUE, value, rawValue)
  //   this.M$internalValues[name] = value
  //   return this
  // }

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
