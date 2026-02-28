import { isNaN, isNumber, isString } from '@glyph-cat/type-checking'
import { IS_SOURCE_ENV } from '../../constants'
import { devError } from '../../dev'
import { OptionalAlpha } from '../abstractions'
import { BaseColorJson, BaseColorObject } from '../base'
import {
  CLOSING_BRACKET_PATTERN,
  ColorConstants,
  DELIMITER_PATTERN,
  RGBA_LEADING_SYNTAX_PATTERN,
} from '../constants'
import { InvalidColorRangeError, InvalidColorStringError } from '../errors'
import { rgbConstructorSpyRef } from '../internals'

/**
 * @public
 */
export interface RGBJson extends BaseColorJson {
  r: number
  g: number
  b: number
}

/**
 * @public
 */
export type RGBTuple = [
  r: RGBJson['r'],
  g: RGBJson['g'],
  b: RGBJson['b'],
  a: RGBJson['a'],
]

/**
 * @public
 */
export interface RGBToStringOptions {
  // TODO
}

/**
 * @public
 */
export class RGBColor extends BaseColorObject {

  static fromString(value: string): RGBColor {
    const [$r, $g, $b, $a] = value
      .replace(RGBA_LEADING_SYNTAX_PATTERN, '')
      .replace(CLOSING_BRACKET_PATTERN, '')
      .split(DELIMITER_PATTERN)
    return new RGBColor(Number($r), Number($g), Number($b), $a ? Number($a) : undefined)
  }

  static fromJSON({ r, g, b, a }: OptionalAlpha<RGBJson>): RGBColor {
    return new RGBColor(r, g, b, a)
  }

  constructor(r: number, g: number, b: number, a?: number)

  /**
   * @internal
   */
  constructor(r: number, g: number, b: number, a?: number, literalValue?: string)

  constructor(
    readonly r: number,
    readonly g: number,
    readonly b: number,
    a?: number,
    literalValue?: string,
  ) {
    // eslint-disable-next-line prefer-rest-params
    if (IS_SOURCE_ENV) { rgbConstructorSpyRef.current?.(...arguments) }
    try {
      if (isNaN(r) || r < ColorConstants.MIN_RGB || r > ColorConstants.MAX_RGB) {
        throw new InvalidColorRangeError('r', r, ColorConstants.MIN_RGB, ColorConstants.MAX_RGB)
      }
      if (isNaN(g) || g < ColorConstants.MIN_RGB || g > ColorConstants.MAX_RGB) {
        throw new InvalidColorRangeError('g', g, ColorConstants.MIN_RGB, ColorConstants.MAX_RGB)
      }
      if (isNaN(b) || b < ColorConstants.MIN_RGB || b > ColorConstants.MAX_RGB) {
        throw new InvalidColorRangeError('b', b, ColorConstants.MIN_RGB, ColorConstants.MAX_RGB)
      }
      if (isNaN(a) || (isNumber(a) && (a < ColorConstants.MIN_ALPHA || a > ColorConstants.MAX_ALPHA))) {
        throw new InvalidColorRangeError('a', a, ColorConstants.MIN_RGB, ColorConstants.MAX_RGB)
      }
    } catch (e) {
      if (isString(literalValue)) {
        devError(InvalidColorStringError.formatMessage(literalValue))
      }
      throw e
    }
    super(a)
  }

  toString(options?: RGBToStringOptions): string {
    if (isNumber(this.a)) {
      return `rgba(${this.r}, ${this.g}, ${this.b}, ${this.a})`
    } else {
      return `rgb(${this.r}, ${this.g}, ${this.b})`
    }
  }

  valueOf(): RGBTuple {
    return [this.r, this.g, this.b, this.a]
  }

  toJSON(): RGBJson {
    return { r: this.r, g: this.g, b: this.b, a: this.a }
  }

}
