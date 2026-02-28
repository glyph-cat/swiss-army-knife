import { isNaN, isNumber, isString } from '@glyph-cat/type-checking'
import { IS_SOURCE_ENV } from '../../constants'
import { devError } from '../../dev'
import { rgbConstructorSpyRef } from '../_internals'
import { OptionalAlpha } from '../abstractions'
import { BaseColorJson, BaseColorObject } from '../base'
import {
  CLOSING_BRACKET_PATTERN,
  DELIMITER_PATTERN,
  MAX_ALPHA,
  MAX_RGB,
  MIN_ALPHA,
  MIN_RGB,
  RGBA_LEADING_SYNTAX_PATTERN,
} from '../constants'
import { InvalidColorRangeError, InvalidColorStringError } from '../errors'

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

  static fromString(literalValue: string): RGBColor {
    const [$r, $g, $b, $a] = literalValue
      .replace(RGBA_LEADING_SYNTAX_PATTERN, '')
      .replace(CLOSING_BRACKET_PATTERN, '')
      .split(DELIMITER_PATTERN)
    return new RGBColor(
      Number($r),
      Number($g),
      Number($b),
      $a ? Number($a) : undefined,
      literalValue,
    )
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
      if (isNaN(r) || r < MIN_RGB || r > MAX_RGB) {
        throw new InvalidColorRangeError('r', r, MIN_RGB, MAX_RGB)
      }
      if (isNaN(g) || g < MIN_RGB || g > MAX_RGB) {
        throw new InvalidColorRangeError('g', g, MIN_RGB, MAX_RGB)
      }
      if (isNaN(b) || b < MIN_RGB || b > MAX_RGB) {
        throw new InvalidColorRangeError('b', b, MIN_RGB, MAX_RGB)
      }
      if (isNaN(a) || (isNumber(a) && (a < MIN_ALPHA || a > MAX_ALPHA))) {
        throw new InvalidColorRangeError('a', a, MIN_RGB, MAX_RGB)
      }
    } catch (error) {
      if (isString(literalValue)) {
        const overrideError = new InvalidColorStringError(literalValue)
        devError(overrideError.message)
        throw overrideError
      } else {
        throw error
      }
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
