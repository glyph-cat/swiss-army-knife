import { isString, Nullable } from '../../data'
import { devError } from '../../dev'
import { isOutOfRange } from '../../math/range'
import { PossiblyUndefined } from '../../types'
import { SerializedColor } from '../abstractions'
import { MAX_RGB_VALUE } from '../constants'

export type ColorSyntaxPair = [value: number, rawValue: string]

export type ColorSyntaxArray = [
  ...ColorSyntaxPair,
  ...ColorSyntaxPair,
  ...ColorSyntaxPair,
  ...ColorSyntaxPair,
]

export function getValuesFromHexString(value: string): ColorSyntaxArray {
  if (!/^#([\da-f]{3,4}|[\da-f]{6}|[\da-f]{8})$/i.test(value)) {
    throw new Error(`Invalid hex code '${value}'`)
  }
  // Matches below are guaranteed because of earlier validations
  value = value.match(/[\da-f]+/i)![0]
  if (value.length <= 4) {
    // Format: '#RGB' or '#RGBA'
    const [r, g, b, a] = value
    return [
      parseInt(`${r}${r}`, 16),
      r,
      parseInt(`${g}${g}`, 16),
      g,
      parseInt(`${b}${b}`, 16),
      b,
      // Alpha is 0 to 1, but since it is in hex, we can derive using max RGB value:
      a ? parseInt(`${a}${a}`, 16) / MAX_RGB_VALUE : null,
      a ?? null,
    ]
  } else {
    // Format: '#RRGGBB' or '#RRGGBBAA'
    const [r1, r2, g1, g2, b1, b2, a1, a2] = value
    const r = `${r1}${r2}`
    const g = `${g1}${g2}`
    const b = `${b1}${b2}`
    const a = `${a1}${a2}`
    return [
      parseInt(r, 16),
      r,
      parseInt(g, 16),
      g,
      parseInt(b, 16),
      b,
      a2 ? parseInt(a, 16) / MAX_RGB_VALUE : null,
      a2 ? a : null,
    ]
  }
}

// https://developer.mozilla.org/en-US/docs/Web/CSS/color_value/rgb
export function getValuesFromRGBString(value: string): ColorSyntaxArray {
  if (!/^rgba?\(\s*\d{1,3}\s+\d{1,3}\s+\d{1,3}(\s+(\d+%|[\d.]+))?\s*\)$/i.test(value.replace(/[,/]/g, ' '))) {
    throw new Error(`Invalid RGB string '${value}'`)
  }
  // Replace here in case of error - we need to show the original string.
  value = value.replace(/[,/]/g, ' ')
  // Matches below are guaranteed because of validation above.
  const [
    redRaw,
    greenRaw,
    blueRaw,
    alphaRaw,
  ] = value.match(/\d{1,3}\s+\d{1,3}\s+\d{1,3}(\s+(\d+%|[\d.]+))?/i)![0].split(/\s+/g)
  return [
    Number(redRaw),
    redRaw,
    Number(greenRaw),
    greenRaw,
    Number(blueRaw),
    blueRaw,
    alphaRaw ? Number(alphaRaw.match(/[\d.]+/)[0]) : null,
    alphaRaw ?? null,
  ]
}

// https://developer.mozilla.org/en-US/docs/Web/CSS/color_value/hsl
export function getValuesFromHSLString(value: string): ColorSyntaxArray {
  value = value.replace(/[,/]/g, ' ')
  if (!/^hsla?\(\s*([\d.]+(deg|rad)?|none)\s+[\d.]+%?\s+[\d.]+%?(\s+[\d.]+%?)?\s*\)$/i.test(value)) {
    throw new Error(`Invalid HSL string '${value}'`)
  }
  // Matches below are guaranteed because of earlier validations
  const [
    hueRaw,
    saturationRaw,
    lightnessRaw,
    alphaRaw,
  ] = value.match(/([\d.]+(deg|rad)?|none)\s+[\d.]+%?\s+[\d.]+%?(\s+[\d.]+%?)?/i)![0].split(/\s+/g)
  const hueStringMatchResult = hueRaw.match(/[\d.]+/)
  return [
    hueStringMatchResult?.[0] ? Number(hueStringMatchResult[0]) : 0,
    hueRaw,
    Number(saturationRaw.match(/[\d.]+/)[0]),
    saturationRaw,
    Number(lightnessRaw.match(/[\d.]+/)[0]),
    lightnessRaw,
    alphaRaw ? Number(alphaRaw.match(/[\d.]+/)[0]) : null,
    alphaRaw ?? null,
  ]
}

export function showErrorIfInvalid(
  name: keyof SerializedColor,
  minValue: number,
  maxValue: number,
  value: number,
  rawValue: number | string,
): void {
  if (name === 'alpha' && isString(rawValue) && /%/.test(rawValue)) {
    // Because alpha can be in percentage or decimal
    maxValue = 100
  }
  if (isOutOfRange(value, minValue, maxValue)) {
    devError(`Expected ${name} value to be equal to or between ${minValue} and ${maxValue} but got: ${isString(rawValue) ? `"${rawValue}"` : `\`${rawValue}\``}`)
  }
}
