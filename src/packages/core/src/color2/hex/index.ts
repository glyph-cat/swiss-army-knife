import { IS_SOURCE_ENV } from '../../constants'
import { BaseColorObject } from '../base'
import { ColorConstants, HEX_COLOR_PATTERN, HEX_EXTRACTION_PATTERN } from '../constants'
import { InvalidColorStringError } from '../errors'
import { hexConstructorSpyRef } from '../internals'
import { RGBColor, RGBJson, RGBTuple } from '../rgb'

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
        a ? parseInt(`${a}${a}`, 16) / ColorConstants.MAX_RGB : ColorConstants.MAX_ALPHA,
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
        (a1 || a2) ? parseInt(a, 16) / ColorConstants.MAX_RGB : ColorConstants.MAX_ALPHA,
        literalValue,
      )
    }

    super(rgbReference.a)
    this.M$rgbReference = rgbReference

  }

  toString(format?: string): string {
    // TODO: If format is specified, use it
    // if # is present, treat as hex
    // r = short hex
    // rr = long hex
    // r, rr, g, gg, b, bb, a, aa
    // R, RR, G, GG, B, BB, A, AA
    return this.literalValue.toLowerCase()
  }

  valueOf(): RGBTuple {
    return this.M$rgbReference.valueOf()
  }

  toJSON(): RGBJson {
    return this.M$rgbReference.toJSON()
  }

}
