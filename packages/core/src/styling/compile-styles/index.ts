import { Properties } from 'csstype'
import { StringRecord } from '../../types'
import { mapPropertyNameFromJSToCSS } from '../map-property-name'
import { serializePixelValue } from '../serialize-pixel-value'

/**
 * Converts property keys of an object with CSS property keys from their JS form
 * (camelCase) to CSS form (kebab-case). The does not mutate the original object.
 * @example
 * convertStyleObjectPropertyKeys({
 *   backgroundColor: '#ffffff',
 *   fontSize: '14pt',
 * })
 * // Output:
 * // {
 * //   'background-color': '#ffffff',
 * //   'font-size': '14pt',
 * // })
 * @public
 */
export function convertStyleObjectPropertyKeys(
  styleObject: Properties
): StringRecord<Properties[keyof Properties]> {
  const compiledStyles: StringRecord<Properties[keyof Properties]> = {}
  for (const rawPropertyKey in styleObject) {
    const propertyValue = styleObject[rawPropertyKey]
    const propertyKey = mapPropertyNameFromJSToCSS(rawPropertyKey)
    compiledStyles[propertyKey] = serializePixelValue(propertyKey, propertyValue)
  }
  return compiledStyles
}

/**
 * Similar to {@link convertStyleObjectPropertyKeys}, but this takes it a step
 * further by compiling the styles into a CSS syntax string.
 * @example
 * compileStyleObjectToString({
 *   backgroundColor: '#ffffff',
 *   fontSize: '14pt',
 * })
 * // Output: '{background-color:#ffffff;font-size:14pt}'
 * @public
 */
export function compileStyleObjectToString(styleObject: Properties): string {
  const compiledStyles: Array<string> = []
  for (const rawPropertyKey in styleObject) {
    const propertyValue = styleObject[rawPropertyKey]
    const propertyKey = mapPropertyNameFromJSToCSS(rawPropertyKey)
    compiledStyles.push(`${propertyKey}:${serializePixelValue(propertyKey, propertyValue)}`)
  }
  return compiledStyles.join(';')
}

/**
 * Uses {@link compileStyleObjectToString} to compile a complete CSS syntax string
 * from a [`Map`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Map)
 * where each key-value pair is the class name and the style object.
 * @example
 * import { Properties } from 'csstype'
 *
 * compileStyles(new Map<string, Properties>([
 *   ['.foo', {
 *     backgroundColor: '#ffffff',
 *   }],
 *   ['.bar', {
 *     backgroundColor: '#ff0000',
 *   }],
 * ]))
 * // Output: '.foo{background-color:#ffffff}.bar{background-color:#ff0000}'
 * @public
 */
export function compileStyles(styles: Map<string, Properties>): string {
  const compiledStyles: Array<string> = []
  styles.forEach((value, key) => {
    // TODO: [low priority] Consider showing warning (in dev environment only) if key is not valid html element and has no leading "." or "#"; perhaps we can have a register function to whitelist custom web components
    compiledStyles.push(`${key}{${compileStyleObjectToString(value)}}`)
  })
  return compiledStyles.join('')
}
