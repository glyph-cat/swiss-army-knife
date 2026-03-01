import { isBoolean, isNaN, isNumber, isString } from '@glyph-cat/type-checking'
import { IS_SOURCE_ENV } from '../../constants'
import { devError } from '../../dev'
import { radToDeg } from '../../math'
import { hslConstructorSpyRef, hslToStringSpyRef } from '../_internals'
import { OptionalAlpha } from '../abstractions'
import { BaseColorJson, BaseColorObject } from '../base'
import {
  CLOSING_BRACKET_PATTERN,
  DEG_RAD_PATTERN,
  DELIMITER_PATTERN,
  HSLA_LEADING_SYNTAX_PATTERN,
  MAX_ALPHA,
  MAX_HUE,
  MAX_LIGHTNESS,
  MAX_SATURATION,
  MIN_ALPHA,
  MIN_HUE,
  MIN_LIGHTNESS,
  MIN_SATURATION,
} from '../constants'
import { InvalidColorRangeError, InvalidColorStringError } from '../errors'

/**
 * @public
 */
export interface HSLJson extends BaseColorJson {
  h: number
  s: number
  l: number
}

/**
 * @public
 */
export type HSLTuple = [
  h: HSLJson['h'],
  s: HSLJson['s'],
  l: HSLJson['l'],
  a: HSLJson['a'],
]

/**
 * @public
 */
export interface HSLToStringOptions {
  includeAlpha?: boolean
}

/**
 * @public
 */
export class HSLColor extends BaseColorObject {

  static fromString(literalValue: string): HSLColor {
    const [$h, $s, $l, $a] = literalValue.toLowerCase()
      .replace(HSLA_LEADING_SYNTAX_PATTERN, '')
      .replace(CLOSING_BRACKET_PATTERN, '')
      .replaceAll('%', '')
      .split(DELIMITER_PATTERN)
    const hue = (() => {
      if ($h === 'none') {
        return MIN_HUE
      } else if ($h) {
        const parsedH = Number($h.replace(DEG_RAD_PATTERN, ''))
        return $h.includes('rad') ? radToDeg(parsedH) : parsedH
      } else {
        return NaN
      }
    })()
    return new HSLColor(
      hue,
      Number($s || NaN),
      Number($l || NaN),
      $a ? Number($a) : undefined,
      literalValue,
    )
  }

  static fromJSON({ h, s, l, a }: OptionalAlpha<HSLJson>): HSLColor {
    return new HSLColor(h, s, l, a)
  }

  constructor(h: number, s: number, l: number, a?: number)

  /**
   * @internal
   */
  constructor(h: number, s: number, l: number, a?: number, literalValue?: string)

  /**
   * @internal
   */
  constructor(
    readonly h: number,
    readonly s: number,
    readonly l: number,
    a?: number,
    literalValue?: string
  ) {
    // eslint-disable-next-line prefer-rest-params
    if (IS_SOURCE_ENV) { hslConstructorSpyRef.current?.(...arguments) }
    try {
      if (isNaN(h) || h < MIN_HUE || h > MAX_HUE) {
        throw new InvalidColorRangeError('h', h, MIN_HUE, MAX_HUE)
      }
      if (isNaN(s) || s < MIN_SATURATION || s > MAX_SATURATION) {
        throw new InvalidColorRangeError('s', s, MIN_SATURATION, MAX_SATURATION)
      }
      if (isNaN(l) || l < MIN_LIGHTNESS || l > MAX_LIGHTNESS) {
        throw new InvalidColorRangeError('l', l, MIN_LIGHTNESS, MAX_LIGHTNESS)
      }
      if (isNaN(a) || (isNumber(a) && (a < MIN_ALPHA || a > MAX_ALPHA))) {
        throw new InvalidColorRangeError('a', a, MIN_ALPHA, MAX_ALPHA)
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

  transform(fn: (values: HSLJson) => HSLJson): HSLColor {
    return HSLColor.fromJSON(fn(this.toJSON())) // todo: test
  }

  toString(options?: HSLToStringOptions): string {
    // eslint-disable-next-line prefer-rest-params
    if (IS_SOURCE_ENV) { hslToStringSpyRef.current?.(...arguments) }
    if ((this.a !== 1 && !isBoolean(options?.includeAlpha)) || options?.includeAlpha) {
      return `hsla(${this.h}, ${this.s}%, ${this.l}%, ${this.a})`
    } else {
      return `hsl(${this.h}, ${this.s}%, ${this.l}%)`
    }
  }

  toJSON(): HSLJson {
    return { h: this.h, s: this.s, l: this.l, a: this.a }
  }

  valueOf(): HSLTuple {
    return [this.h, this.s, this.l, this.a]
  }

}
