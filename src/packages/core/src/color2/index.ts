import { isString } from '@glyph-cat/type-checking'
import { throwInternalError } from '../_internals'
import { devError } from '../dev'
import {
  ColorConstants,
  HSLA_QUICK_MATCH_PATTERN,
  RGBA_QUICK_MATCH_PATTERN,
} from './constants'
import {
  InvalidColorStringError,
  InvalidColorValueError,
  MalformedColorSourceError,
} from './errors'
import { HexColor } from './hex'
import { HSLColor } from './hsl'
import { RGBColor } from './rgb'

/**
 * @public
 */
export class Color {

  static readonly rgb = RGBColor

  static readonly hex = HexColor

  static readonly hsl = HSLColor

  private readonly M$originalValue?: string

  readonly source: RGBColor | HexColor | HSLColor

  constructor(string: string) // Quickly guess format based on first character ('#' | 'r' | 'h')
  constructor(rgb: RGBColor)
  constructor(hex: HexColor)
  constructor(hsl: HSLColor)

  constructor(value: string | RGBColor | HexColor | HSLColor) {
    if (isString(value)) {
      this.M$originalValue = value
      if (value[0] === '#') {
        this.source = new HexColor(value)
      } else if (RGBA_QUICK_MATCH_PATTERN.test(value[0])) {
        this.source = RGBColor.fromString(value)
      } else if (HSLA_QUICK_MATCH_PATTERN.test(value[0])) {
        this.source = HSLColor.fromString(value)
      } else {
        throw new InvalidColorStringError(value)
      }
    } else if (
      value instanceof Color.hsl ||
      value instanceof Color.hex ||
      value instanceof Color.rgb
    ) {
      this.source = value
    } else {
      // NOTE: For simplicity, JSON is not supported unless it becomes more
      // frequently used at a later time.
      devError('Unable to instantiate Color from:', value)
      throw new InvalidColorValueError(value)
    }
  }

  toString(): string

  toString(
    format: typeof RGBColor,
    ...options: Parameters<RGBColor['toString']>
  ): string

  toString(
    format: typeof HexColor,
    ...options: Parameters<HexColor['toString']>
  ): string

  toString(
    format: typeof HSLColor,
    ...options: Parameters<HSLColor['toString']>
  ): string

  toString(
    format?: typeof RGBColor | typeof HexColor | typeof HSLColor,
    ...options: Parameters<(RGBColor | HexColor | HSLColor)['toString']>
  ): string {
    if (format) {
      if (Object.is(format, HexColor)) {
        return this.toHex().toString(...options as [string])
      } else if (Object.is(format, RGBColor)) {
        return this.toRGB().toString(...options)
      } else if (Object.is(format, HSLColor)) {
        return this.toHSL().toString(...options)
      } else {
        throw new Error(`Invalid format: ${format}`)
      }
    } else {
      if (this.M$originalValue) {
        return this.M$originalValue
      } else {
        return this.source.toString()
      }
    }
  }

  toRGB(): RGBColor {
    if (this.source instanceof RGBColor) {
      return this.source
    } else if (this.source instanceof HexColor) {
      return this.source.M$rgbReference
    } else if (this.source instanceof HSLColor) {
      return null! // TODO: HSL to RGB
    }
    throwInternalError(new MalformedColorSourceError())
  }

  toHex(): HexColor {
    if (this.source instanceof HexColor) {
      return this.source
    } else if (this.source instanceof RGBColor) {
      const formatHexDoubleDigit = (value: number) => value.toString(16).padStart(2, '0')
      return new HexColor('#' +
        formatHexDoubleDigit(this.source.r) +
        formatHexDoubleDigit(this.source.g) +
        formatHexDoubleDigit(this.source.b) +
        formatHexDoubleDigit(this.source.a * ColorConstants.MAX_RGB)
      )
    } else if (this.source instanceof HSLColor) {
      // TODO
    }
    throwInternalError(new MalformedColorSourceError())
  }

  toHSL(): HSLColor {
    if (this.source instanceof HSLColor) {
      return this.source
    } else if (this.source instanceof RGBColor) {
      // TODO
    } else if (this.source instanceof HexColor) {
      // TODO
    }
    throwInternalError(new MalformedColorSourceError())
  }

}
