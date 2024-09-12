// #region Imports
import { IS_CLIENT_ENV } from '../../constants'
import {
  hasEitherProperties,
  hasProperty,
  isFunction,
  isNull,
  isNullOrUndefined,
  isNumber,
  isObject,
  isString,
  trySerialize
} from '../../data'
import { devError } from '../../dev'
import { average, clamp } from '../../math'
import { LenientString, NumericValues3 } from '../../types'
import {
  ColorFormat,
  ColorModifier,
  ContrastingValueSpecifications,
  MultiColorModifier,
  SerializedColor,
  SerializedHSL,
  SerializedRGB,
  WithAlphaAsOptional,
} from './abstractions'
import { LOOKUP_DICTIONARY } from './lookup'
import {
  getValuesFromHexString,
  getValuesFromHSLString,
  getValuesFromRGBString,
} from './util'
// #endregion Imports

// /* eslint-disable */

// #region Public utilities
/**
 * @public
 */
export namespace ColorUtil {

  /**
   * Converts HSL values to RGB values.
   * @param hue - 
   * @param saturation - 
   * @param lightness - 
   * @returns  A tuple containing 3 numbers that represent the `[red, green, blue]` values.
   * @public
   */
  export function fromHSLToRGB(
    hue: number, // todo: decide whether in deg or rad
    saturation: number, // todo: decide whether in 0-1 or 0-100
    lightness: number // todo: decide whether in 0-1 or 0-100
  ): NumericValues3 {
    return [0, 0, 0] // todo
  }

  /**
   * Converts RGB values to HSL values.
   * @param red - The red value in integer form (between 0 to 255)
   * @param green - The green value in integer form (between 0 to 255)
   * @param blue - The blue value in integer form (between 0 to 255)
   * @returns A tuple containing 3 numbers that represent the `[hue, saturation, lightness]`.
   * @public
   */
  export function fromRGBToHSL(red: number, green: number, blue: number): NumericValues3 {
    // Reference: https://www.niwa.nu/2013/05/math-behind-colorspace-conversions-rgb-hsl
    // todo: refactor and refine
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
    const hue = (() => {
      if (r === maxRGB) {
        return (g - b) / maxMinRGBDiff
      } else if (g === maxRGB) {
        return 2 + (b - r) / maxMinRGBDiff
      } else {
        return 4 + (r - g) / maxMinRGBDiff
      }
    })()
    return [(hue < 0 ? hue + 360 : hue) * 60, 100 * saturation, 100 * lightness]
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
   */
  export function getLuminance(red: number, green: number, blue: number): number {
    return 0.21 * red + 0.72 * green + 0.07 * blue
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
    return (color: string): T => {
      const clampedThreshold = clamp(threshold, Color.MIN_RGB_VALUE, Color.MAX_RGB_VALUE)
      return Color.fromString(color).luminance >= clampedThreshold ? lightValue : darkValue
    }
  }

}

// #endregion Public utilities

/**
 * @public
 */
export class Color {

  // #region Constants
  static readonly MIN_ALPHA_VALUE = 0
  static readonly MAX_ALPHA_VALUE = 1
  static readonly MIN_RGB_VALUE = 0
  static readonly MAX_RGB_VALUE = 255
  static readonly MIN_HUE_VALUE = 0
  static readonly MAX_HUE_VALUE = 360
  static readonly MIN_SATURATION_VALUE = 0 // todo: confirm format
  static readonly MAX_SATURATION_VALUE = 1 // todo: confirm format
  static readonly MIN_LIGHTNESS_VALUE = 0 // todo: confirm format
  static readonly MAX_LIGHTNESS_VALUE = 1 // todo: confirm format
  // #endregion Constants

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
    const color = new Color()
      .M$validateAndAssignRGB('red', red, red)
      .M$validateAndAssignRGB('green', green, green)
      .M$validateAndAssignRGB('blue', blue, blue)
    if (!isNullOrUndefined(alpha)) { color.M$validateAndAssignAlpha(alpha, alpha) }
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
    const color = new Color()
      .M$validateAndAssignRGB('red', red, redRaw)
      .M$validateAndAssignRGB('green', green, greenRaw)
      .M$validateAndAssignRGB('blue', blue, blueRaw)
    if (!isNullOrUndefined(alpha)) { color.M$validateAndAssignAlpha(alpha, alphaRaw) }
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
    const color = new Color()
      .M$validateAndAssign('hue', hue, hue)
      .M$validateAndAssign('saturation', saturation, saturation)
      .M$validateAndAssign('lightness', lightness, lightness)
    if (!isNullOrUndefined(alpha)) { color.M$validateAndAssignAlpha(alpha, alpha) }
    return color
  }

  static fromHSLObject(value: WithAlphaAsOptional<SerializedHSL>): Color {
    const { hue, saturation, lightness, alpha } = value
    return Color.fromHSLValues(hue, saturation, lightness, alpha)
  }

  static fromHSLString(value: string): Color {
    const [
      hue, hueRaw,
      saturation, saturationRaw,
      lightness, lightnessRaw,
      alpha, alphaRaw,
    ] = getValuesFromHSLString(value)
    const color = new Color()
      .M$validateAndAssign('hue', hue, hueRaw)
      .M$validateAndAssign('saturation', saturation, saturationRaw)
      .M$validateAndAssign('lightness', lightness, lightnessRaw)
    if (!isNullOrUndefined(alpha)) { color.M$validateAndAssignAlpha(alpha, alphaRaw) }
    return color
  }

  // #endregion .fromHSL

  // #region .fromString

  static fromHex(value: string): Color {
    const [
      red, redRaw,
      green, greenRaw,
      blue, blueRaw,
      alpha, alphaRaw,
    ] = getValuesFromHexString(value)
    const color = new Color()
      .M$validateAndAssignRGB('red', red, redRaw)
      .M$validateAndAssignRGB('green', green, greenRaw)
      .M$validateAndAssignRGB('blue', blue, blueRaw)
    if (!isNullOrUndefined(alpha)) { color.M$validateAndAssignAlpha(alpha, alphaRaw) }
    return color
  }

  static fromString(value: string): Color {
    if (/^\s*#/.test(value)) {
      return Color.fromHex(value)
    } else if (/^\s*rgb/i.test(value)) {
      return Color.fromRGBString(value)
    } else if (/^\s*hsl/i.test(value)) {
      return Color.fromHSLString(value)
    } else {
      throw new Error(`Invalid hex color code '${value}'`)
    }
  }

  // #endregion `fromString`

  static fromJSON(value: SerializedRGB | SerializedHSL): Color {
    // Using `hasProperty` only because all fields are mandatory here
    // can use static `from...` methods here because the values are not processed
    // before being passed to the constructor.
    if (hasProperty(value, 'red')) {
      return Color.fromRGBObject(value as SerializedRGB)
    } else if (hasProperty(value, 'hue')) {
      return Color.fromHSLObject(value as SerializedHSL)
    }
    throw new Error(`Invalid object: ${trySerialize(value)}`)
  }

  // #region Class properties
  private M$isInvalid: boolean = false
  private M$red: number = null
  private M$green: number = null
  private M$blue: number = null
  private M$alpha: number = Color.MAX_ALPHA_VALUE
  private M$lightness: number = null
  private M$hue: number = null
  private M$saturation: number = null
  // #endregion Class properties

  private constructor() {
    // Empty but required for the `private` modifier to be effective
  }

  // #region Getters

  get isInvalid(): boolean {
    return this.M$isInvalid
  }

  get red(): number {
    if (isNull(this.M$red)) { this.initRGBValues() }
    return this.M$red
  }

  get green(): number {
    if (isNull(this.M$green)) { this.initRGBValues() }
    return this.M$green
  }

  get blue(): number {
    if (isNull(this.M$blue)) { this.initRGBValues() }
    return this.M$blue
  }

  get alpha(): number {
    return this.M$alpha
  }

  get lightness(): number {
    if (isNull(this.M$lightness)) { this.initHSLValues() }
    return this.M$lightness
  }

  get hue(): number {
    if (isNull(this.M$hue)) { this.initHSLValues() }
    return this.M$hue
  }

  get saturation(): number {
    if (isNull(this.M$saturation)) { this.initHSLValues() }
    return this.M$saturation
  }

  /**
   * The perceived brightness of the color.
   */
  get luminance(): number {
    return ColorUtil.getLuminance(this.red, this.green, this.blue)
  }

  // #endregion Getters

  // #region Setters

  setRed(value: number | ColorModifier): Color {
    if (isFunction(value)) {
      const nextValue = value(this.red)
      return this.M$clone().M$validateAndAssignRGB('red', nextValue, nextValue)
    } else {
      return this.M$clone().M$validateAndAssignRGB('red', value, value)
    }
  }

  setBlue(value: number | ColorModifier): Color {
    if (isFunction(value)) {
      const nextValue = value(this.blue)
      return this.M$clone().M$validateAndAssignRGB('blue', nextValue, nextValue)
    } else {
      return this.M$clone().M$validateAndAssignRGB('blue', value, value)
    }
  }

  setGreen(value: number | ColorModifier): Color {
    if (isFunction(value)) {
      const nextValue = value(this.green)
      return this.M$clone().M$validateAndAssignRGB('green', nextValue, nextValue)
    } else {
      return this.M$clone().M$validateAndAssignRGB('green', value, value)
    }
  }

  setAlpha(value: number | ColorModifier): Color {
    if (isFunction(value)) {
      const nextValue = value(this.alpha)
      return this.M$clone().M$validateAndAssignAlpha(nextValue, nextValue)
    } else {
      return this.M$clone().M$validateAndAssignAlpha(value, value)
    }
  }

  setHue(value: number | ColorModifier): Color {
    if (isFunction(value)) {
      const nextValue = value(this.hue)
      return this.M$clone().M$validateAndAssign('hue', nextValue, nextValue)
    } else {
      return this.M$clone().M$validateAndAssign('hue', value, value)
    }
  }

  setSaturation(value: number | ColorModifier): Color {
    if (isFunction(value)) {
      const nextValue = value(this.saturation)
      return this.M$clone().M$validateAndAssign('saturation', nextValue, nextValue)
    } else {
      return this.M$clone().M$validateAndAssign('saturation', value, value)
    }
  }

  setLightness(value: number | ColorModifier): Color {
    if (isFunction(value)) {
      const nextValue = value(this.lightness)
      return this.M$clone().M$validateAndAssign('lightness', nextValue, nextValue)
    } else {
      return this.M$clone().M$validateAndAssign('lightness', value, value)
    }
  }

  set(rgb: Partial<SerializedRGB>): Color

  set(hsl: Partial<SerializedHSL>): Color

  set(modifier: MultiColorModifier): Color

  set(
    partialValueOrModifier: Partial<SerializedRGB> | Partial<SerializedHSL> | MultiColorModifier
  ): Color {
    // todo: find a way to exclude `luminance`
    const currentValues = this.toJSON()
    // todo: need validate + assign
    if (hasEitherProperties(partialValueOrModifier, 'red', 'green', 'blue')) {
      return Color.fromRGBObject({
        red: this.red,
        green: this.green,
        blue: this.blue,
        ...partialValueOrModifier,
      })
    } else if (hasEitherProperties(partialValueOrModifier, 'hue', 'saturation', 'lightness')) {
      return Color.fromHSLObject({
        hue: this.hue,
        saturation: this.saturation,
        lightness: this.lightness,
        ...partialValueOrModifier,
      })
    } else if (isFunction(partialValueOrModifier)) {
      return Color.fromJSON(partialValueOrModifier(currentValues))
    }
    throw new Error('') // todo
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

  toString(format?: ColorFormat, truncateDecimals?: number): string {
    if (this.isInvalid) { return '#InvalidColor' }
    // note - truncateDecimals can be done using `.toFixed(...)`
    return 'todo' // todo
  }

  valueOf(): string {
    return this.toString()
  }

  // #endregion Serialization

  // #region Private instance helpers

  private initRGBValues = (): void => {
    const [r, g, b] = ColorUtil.fromHSLToRGB(this.M$hue, this.M$saturation, this.M$lightness)
    this.M$red = r
    this.M$green = g
    this.M$blue = b
  }

  private initHSLValues = (): void => {
    const [h, s, l] = ColorUtil.fromRGBToHSL(this.M$red, this.M$green, this.M$blue)
    this.M$hue = h
    this.M$saturation = s
    this.M$lightness = l
  }

  private M$clone = (): Color => {
    const newObj = new Color()
    newObj.M$red = this.M$red
    newObj.M$green = this.M$green
    newObj.M$blue = this.M$blue
    newObj.M$alpha = this.M$alpha
    newObj.M$lightness = this.M$lightness
    newObj.M$hue = this.M$hue
    newObj.M$saturation = this.M$saturation
    return newObj
  }

  /**
   * @deprecated
   * - To have one validator for each color field.
   * - for RGB need to accommodate [base-10] and [hex]
   * - for % values need to handle [%] and [0.1]
   */
  private M$validateAndAssign = (
    name: keyof SerializedColor,
    value: number,
    rawValue: unknown,
  ): this => {
    this[`$${name}`] = name !== 'alpha' ? value : (value ?? Color.MAX_ALPHA_VALUE)
    const [minValue, maxValue] = validationRanges[name]
    this.M$validateBase(name, minValue, maxValue, value, rawValue)
    return this
  }

  private M$validateBase = (
    name: keyof SerializedColor,
    minValue: number,
    maxValue: number,
    value: number,
    rawValue: unknown,
    // kiv: extra flag to trigger display min/max values in error message in hex???
  ): void => {
    if (value < minValue || value > maxValue) {
      devError(`Expected ${name} value to be equal to or between ${minValue} and ${maxValue} but got <${rawValue}>`)
      this.M$isInvalid = true
    }
  }

  private M$validateAndAssignAlpha = (
    value: number,
    rawValue: unknown,
  ): this => {
    // todo: handle `alpha` can be 0.39 or 39% based on raw value
    this.M$alpha = value ?? Color.MAX_ALPHA_VALUE
    this.M$validateBase(
      'alpha',
      Color.MIN_ALPHA_VALUE,
      Color.MAX_ALPHA_VALUE,
      value,
      rawValue,
    )
    return this
  }

  private M$validateAndAssignRGB = (
    name: 'red' | 'green' | 'blue',
    value: number,
    rawValue: unknown,
  ): this => {
    this[`$${name}`] = value
    const [minValue, maxValue] = validationRanges[name]
    this.M$validateBase(name, minValue, maxValue, value, rawValue)
    return this
  }

  // #endregion Private instance helpers

}

/**
 * @deprecated
 */
const validationRanges: Record<keyof SerializedColor, [min: number, max: number]> = {
  red: [Color.MIN_RGB_VALUE, Color.MAX_RGB_VALUE],
  green: [Color.MIN_RGB_VALUE, Color.MAX_RGB_VALUE],
  blue: [Color.MIN_RGB_VALUE, Color.MAX_RGB_VALUE],
  alpha: [Color.MIN_ALPHA_VALUE, Color.MAX_ALPHA_VALUE],
  hue: [Color.MIN_HUE_VALUE, Color.MAX_HUE_VALUE],
  saturation: [Color.MIN_SATURATION_VALUE, Color.MAX_SATURATION_VALUE],
  lightness: [Color.MIN_RGB_VALUE, Color.MAX_RGB_VALUE],
  luminance: [0, 1], // dummy
}

/**
 * @public
 */
export namespace ColorLookup {

  /**
   * Get a {@link Color} from the CSS color name.
   * @param name - Name of the color.
   * @example
   * 
   * @returns A {@link Color} object if it is a valid CSS color name, otherwise `null`.
   * @public
   */
  export function fromCSSName(name: LenientString<string>): Color {
    name = name.toLowerCase()
    if (LOOKUP_DICTIONARY[name]) {
      return Color.fromHex(LOOKUP_DICTIONARY[name])
    }
    return null
  }

  /**
   * Get the CSS color name from a {@link Color}.
   * @param color - The color to look up.
   * @example
   * 
   * @returns A string representing the name of the color if it happens to have a
   * name, otherwise `null`.
   * @public
   */
  export function toCSSName(color: Color): string {
    const hexCode = color.toString(ColorFormat.ffffff)
    return LOOKUP_DICTIONARY[hexCode] ?? null
  }

}

// #region Exports
export * from './abstractions/public'
// #endregion Exports
