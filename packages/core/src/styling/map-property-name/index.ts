import { Properties } from 'csstype'
import { LenientString } from '../../types'

/**
 * Converts CSS property names from camelCase (used in JS) to kebab-case (used in CSS).
 * @see https://www.geeksforgeeks.org/how-to-convert-a-string-into-kebab-case-using-javascript
 * @public
 */
export function mapPropertyNameFromJSToCSS(value: LenientString<keyof Properties>): string {
  const operaPropertyPattern = /^O/
  if (operaPropertyPattern.test(value)) {
    value = value.replace(operaPropertyPattern, 'o-')
  }
  let parsedValue = value.replace(/([a-z])([A-Z])/g, '$1-$2')
    .replace(/[\s_]+/g, '-')
    .toLowerCase()
  if (parsedValue.match(/^(moz|ms|o|webkit)(?=-)/)) {
    parsedValue = `-${parsedValue}`
  }
  return parsedValue
}
