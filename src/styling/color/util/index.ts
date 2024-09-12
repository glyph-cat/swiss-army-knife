import { Color } from '..'

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
  value = value.match(/[\da-f]+/i)[0]
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
      a ? parseInt(`${a}${a}`, 16) / Color.MAX_RGB_VALUE : null,
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
      a2 ? parseInt(a, 16) / Color.MAX_RGB_VALUE : null,
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
  ] = value.match(/\d{1,3}\s+\d{1,3}\s+\d{1,3}(\s+(\d+%|[\d.]+))?/i)[0].split(/\s+/g)
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
// todo: handle alpha in 'n%' format and normalize to `0-1`, should be handled like




// todo: can include mdn reference for syntax in the inline docs, relative syntax not supported only



// todo: normalize hue into deg values
// todo: decide in which format `39` or `0.39` we want to use for saturation and lightness
// ...wait, these should be done inside `M$validateAndAssign`???
// problem is with showing raw value for debugging only
// might need to have n sets of validators for each color property

// https://developer.mozilla.org/en-US/docs/Web/CSS/color_value/hsl#syntax
export function getValuesFromHSLString(value: string): ColorSyntaxArray {
  value = value.replace(/[,/]/g, ' ')
  if (!/^\s*hsla?\(\s*([\d.]+(deg|rad)?|none)\s+[\d.]+%?\s+[\d.]+%?(\s+[\d.]+%?)?\s*\)\s*$/i.test(value)) {
    throw new Error(`Invalid HSL string '${value}'`)
  }
  // Matches below are guaranteed because of earlier validations
  const [
    hueRaw,
    saturationRaw,
    lightnessRaw,
    alphaRaw,
  ] = value.match(/([\d.]+(deg|rad)?|none)\s+[\d.]+%?\s+[\d.]+%?(\s+[\d.]+%?)?/i)[0].split(/\s+/g)
  return [
    Number(hueRaw.match(/[\d.]+/)[0]),
    hueRaw,
    Number(saturationRaw.match(/[\d.]+/)[0]),
    saturationRaw,
    Number(lightnessRaw.match(/[\d.]+/)[0]),
    lightnessRaw,
    alphaRaw ? Number(alphaRaw.match(/[\d.]+/)[0]) : null,
    alphaRaw ?? null,
  ]
}

// * NOTE: for alpha value, there are two valid syntaxes:
// * - with % (Example: '39%')
// * - without % (Example: '0.39')
// * '39' alone is invalid and will be treated by CSS as without '%', capping the value at '1'



// /**
//  * Parse alpha value from string syntax.
//  *
//  * NOTE: for alpha value, there are two valid syntaxes:
//  * - with % (Example: '39%')
//  * - without % (Example: '0.39')
//  * '39' alone is invalid and will be treated by CSS as without '%', capping the value at '1'
//  * @param value - The raw value.
//  * @returns Decimal representation of alpha value as a number between `0` and `1`.
//  */
// export function getNormalizedAlphaValue(value: string): number {
//   const numericValue = Number(value.match(/[\d.]+/)[0])
//   if (/%/.test(value)) {
//     return numericValue / 100
//   } else {
//     return numericValue
//   }
// }
