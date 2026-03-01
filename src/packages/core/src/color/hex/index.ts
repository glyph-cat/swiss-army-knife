import { IS_SOURCE_ENV } from '../../constants'
import { hexConstructorSpyRef, hexToStringSpyRef } from '../_internals'
import { BaseColorObject } from '../base'
import { HEX_COLOR_PATTERN, HEX_EXTRACTION_PATTERN, MAX_ALPHA, MAX_RGB } from '../constants'
import { InvalidColorStringError } from '../errors'
import { RGBColor, RGBJson, RGBTuple } from '../rgb'
import { getDoubleDigitHex } from '../utils/get-double-digit-hex'

/**
 * @public
 */
export type HexColorFormat = | '#rgb' | '#rgba' | '#rrggbb' | '#rrggbbaa'

/**
 * @public
 */
export class HexColor extends BaseColorObject implements RGBJson {

  /**
   * @internal
   */
  M$rgbReference: RGBColor

  get r(): number { return this.M$rgbReference.r }

  get g(): number { return this.M$rgbReference.g }

  get b(): number { return this.M$rgbReference.b }

  constructor(readonly literalValue: string) {

    // eslint-disable-next-line prefer-rest-params
    if (IS_SOURCE_ENV) { hexConstructorSpyRef.current?.(...arguments) }

    if (!HEX_COLOR_PATTERN.test(literalValue)) {
      throw new InvalidColorStringError(literalValue)
    }

    let rgbReference: RGBColor
    const matchedValue = literalValue.match(HEX_EXTRACTION_PATTERN)![0]

    if (matchedValue.length <= 4) {
      // Format: '#RGB' or '#RGBA'
      const [r, g, b, a] = matchedValue
      rgbReference = new RGBColor(
        parseInt(`${r}${r}`, 16),
        parseInt(`${g}${g}`, 16),
        parseInt(`${b}${b}`, 16),
        a ? parseInt(`${a}${a}`, 16) / MAX_RGB : MAX_ALPHA,
        literalValue,
      )
    } else {
      // Format: '#RRGGBB' or '#RRGGBBAA'
      const [r1, r2, g1, g2, b1, b2, a1, a2] = matchedValue
      const r = `${r1}${r2}`
      const g = `${g1}${g2}`
      const b = `${b1}${b2}`
      const a = `${a1}${a2}`
      rgbReference = new RGBColor(
        parseInt(r, 16),
        parseInt(g, 16),
        parseInt(b, 16),
        (a1 || a2) ? parseInt(a, 16) / MAX_RGB : MAX_ALPHA,
        literalValue,
      )
    }

    super(rgbReference.a)
    this.M$rgbReference = rgbReference

  }

  toString(format?: HexColorFormat): string {
    // eslint-disable-next-line prefer-rest-params
    if (IS_SOURCE_ENV) { hexToStringSpyRef.current?.(...arguments) }
    if (format) {
      const { r, g, b, a } = this.M$rgbReference
      const rr = getDoubleDigitHex(r)
      const gg = getDoubleDigitHex(g)
      const bb = getDoubleDigitHex(b)
      const aa = getDoubleDigitHex(a * MAX_RGB)
      const rrggbbMatches = rr[0] === rr[1] && gg[0] === gg[1] && bb[0] === bb[1]
      if (format === '#rgb') {
        if (rrggbbMatches) {
          return '#' + rr[0] + gg[0] + bb[0]
        } else {
          format = '#rrggbb' // fallback
        }
      } else if (format === '#rgba') {
        if (rrggbbMatches && aa[0] === aa[1]) {
          return '#' + rr[0] + gg[0] + bb[0] + aa[0]
        } else {
          format = '#rrggbbaa' // fallback
        }
      } else if (format === '#rrggbb') {
        return '#' + rr + gg + bb
      } else if (format === '#rrggbbaa') {
        return '#' + rr + gg + bb + aa
      } else {
        throw new Error(`Invalid hex format "${format}"`)
      }
    }
    return this.literalValue.toLowerCase()
  }

  valueOf(): RGBTuple {
    return this.M$rgbReference.valueOf()
  }

  toJSON(): RGBJson {
    return this.M$rgbReference.toJSON()
  }

}
