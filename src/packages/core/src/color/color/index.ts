import { isString } from '@glyph-cat/type-checking'
import { throwInternalError } from '../../_internals'
import { devError } from '../../dev'
import {
  HSLA_QUICK_MATCH_PATTERN,
  MAX_ALPHA,
  MAX_HUE,
  MAX_LIGHTNESS,
  MAX_RGB,
  MAX_SATURATION,
  MIN_ALPHA,
  MIN_HUE,
  MIN_LIGHTNESS,
  MIN_RGB,
  MIN_SATURATION,
  RGBA_QUICK_MATCH_PATTERN,
} from '../constants'
import {
  InvalidColorStringError,
  InvalidColorValueError,
  MalformedColorSourceError,
} from '../errors'
import { HexColor } from '../hex'
import { HSLColor } from '../hsl'
import { RGBColor } from '../rgb'
import { getDoubleDigitHex } from '../utils/get-double-digit-hex'
import { getLuminance } from '../utils/get-luminance'
import { hslToRgb } from '../utils/hsl-to-rgb'
import { rgbToHsl } from '../utils/rgb-to-hsl'

/**
 * @public
 */
export class Color {

  static readonly MIN_ALPHA = MIN_ALPHA
  static readonly MAX_ALPHA = MAX_ALPHA
  static readonly MIN_RGB = MIN_RGB
  static readonly MAX_RGB = MAX_RGB
  static readonly MIN_HUE = MIN_HUE
  static readonly MAX_HUE = MAX_HUE
  static readonly MIN_SATURATION = MIN_SATURATION
  static readonly MAX_SATURATION = MAX_SATURATION
  static readonly MIN_LIGHTNESS = MIN_LIGHTNESS
  static readonly MAX_LIGHTNESS = MAX_LIGHTNESS

  static rgb(...args: ConstructorParameters<typeof RGBColor>): RGBColor {
    return new RGBColor(...args)
  }

  static hex(...args: ConstructorParameters<typeof HexColor>): HexColor {
    return new HexColor(...args)
  }

  static hsl(...args: ConstructorParameters<typeof HSLColor>): HSLColor {
    return new HSLColor(...args)
  }

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
      value instanceof HSLColor ||
      value instanceof HexColor ||
      value instanceof RGBColor
    ) {
      this.source = value
    } else {
      // NOTE: For simplicity, JSON is not supported unless it becomes more
      // frequently used at a later time.
      devError('Unable to instantiate Color from:', value)
      throw new InvalidColorValueError(value)
    }
  }

  /**
   * @internal
   */
  private M$luminance?: number

  get luminance(): number {
    if (!this.M$luminance) {
      this.M$luminance = getLuminance(...this.toRGB().valueOf())
    }
    return this.M$luminance
  }

  toString(): string

  toString(
    format: typeof RGBColor | typeof Color.rgb,
    ...options: Parameters<RGBColor['toString']>
  ): string

  toString(
    format: typeof HexColor | typeof Color.hex,
    ...options: Parameters<HexColor['toString']>
  ): string

  toString(
    format: typeof HSLColor | typeof Color.hsl,
    ...options: Parameters<HSLColor['toString']>
  ): string

  toString(
    format?: typeof RGBColor | typeof HexColor | typeof HSLColor |
      typeof Color.rgb | typeof Color.hsl | typeof Color.hex,
    ...options: Parameters<(RGBColor | HexColor | HSLColor)['toString']>
  ): string {
    if (format) {
      if (Object.is(format, Color.hex) || Object.is(format, HexColor)) {
        return this.toHex().toString(...options as [string])
      } else if (Object.is(format, Color.rgb) || Object.is(format, RGBColor)) {
        return this.toRGB().toString(...options as Parameters<RGBColor['toString']>)
      } else if (Object.is(format, Color.hsl) || Object.is(format, HSLColor)) {
        return this.toHSL().toString(...options as Parameters<HSLColor['toString']>)
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
      const { h, s, l, a } = this.source
      return new RGBColor(...hslToRgb(h, s, l), a)
    }
    throwInternalError(new MalformedColorSourceError())
  }

  toHex(): HexColor {
    if (this.source instanceof HexColor) {
      return this.source
    } else if (this.source instanceof RGBColor) {
      const { r, g, b, a } = this.source
      return new HexColor('#' +
        getDoubleDigitHex(r) +
        getDoubleDigitHex(g) +
        getDoubleDigitHex(b) +
        getDoubleDigitHex(a * MAX_RGB)
      )
    } else if (this.source instanceof HSLColor) {
      const { h, s, l, a } = this.source
      const [r, g, b] = hslToRgb(h, s, l)
      return new HexColor('#' +
        getDoubleDigitHex(r) +
        getDoubleDigitHex(g) +
        getDoubleDigitHex(b) +
        getDoubleDigitHex(a * MAX_RGB)
      )
    }
    throwInternalError(new MalformedColorSourceError())
  }

  toHSL(): HSLColor {
    if (this.source instanceof HSLColor) {
      return this.source
    } else if (this.source instanceof RGBColor) {
      const { r, g, b, a } = this.source
      return new HSLColor(...rgbToHsl(r, g, b), a)
    } else if (this.source instanceof HexColor) {
      const { r, g, b, a } = this.source.M$rgbReference
      return new HSLColor(...rgbToHsl(r, g, b), a)
    }
    throwInternalError(new MalformedColorSourceError())
  }

}
