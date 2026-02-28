import { isNumber, isString } from '@glyph-cat/type-checking'
import { IS_SOURCE_ENV } from '../../constants'
import { devError } from '../../dev'
import { radToDeg } from '../../math'
import { hslConstructorSpyRef } from '../_internals'
import { OptionalAlpha } from '../abstractions'
import { BaseColorJson, BaseColorObject } from '../base'
import {
  CLOSING_BRACKET_PATTERN,
  DELIMITER_PATTERN,
  HSLA_LEADING_SYNTAX_PATTERN,
  MIN_HUE,
} from '../constants'
import { InvalidColorStringError } from '../errors'

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
  // TODO
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
      } else {
        const parsedH = Number($h)
        return $h.includes('rad') ? radToDeg(parsedH) : parsedH
      }
    })()
    return new HSLColor(
      hue,
      Number($s),
      Number($l),
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
    // TODO: range validation
    try {

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

  toString(options?: HSLToStringOptions): string {
    if (isNumber(this.a)) {
      return `hsla(${this.h}, ${this.s}, ${this.l}, ${this.a})`
    } else {
      return `hsl(${this.h}, ${this.s}, ${this.l})`
    }
  }

  valueOf(): HSLTuple {
    return [this.h, this.s, this.l, this.a]
  }

  toJSON(): HSLJson {
    return { h: this.h, s: this.s, l: this.l, a: this.a }
  }

}
