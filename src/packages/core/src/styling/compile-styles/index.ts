import { IS_DEBUG_ENV } from '../../constants'
import { devWarn } from '../../dev'
import { StringRecord } from '../../types'
import { ExtendedCSSProperties } from '../abstractions'
import { mapPropertyNameFromJSToCSS } from '../map-property-name'
import { normalizeCSSValue } from '../normalize-css-value'
import { StyleMap } from '../style-map'
import { selectorsToIgnore, tryValidateCSSSelector } from './validator'

/**
 * Converts property keys of an object with CSS property keys from their JS form
 * (camelCase) to CSS form (kebab-case). The does not mutate the original object.
 * @param styles - The style object.
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
  styles: ExtendedCSSProperties
): StringRecord<ExtendedCSSProperties[keyof ExtendedCSSProperties]> {
  const compiledStyles: StringRecord<ExtendedCSSProperties[keyof ExtendedCSSProperties]> = {}
  for (const rawPropertyKey in styles) {
    const propertyValue = styles[rawPropertyKey]
    const propertyKey = mapPropertyNameFromJSToCSS(rawPropertyKey)
    compiledStyles[propertyKey] = normalizeCSSValue(propertyKey, propertyValue)
  }
  return compiledStyles
}

/**
 * Similar to {@link convertStyleObjectPropertyKeys}, but this takes it a step
 * further by compiling the styles into a CSS syntax string.
 * @param styles - The style object.
 * @example
 * compileStyleObjectToString({
 *   backgroundColor: '#ffffff',
 *   fontSize: '14pt',
 * })
 * // Output: '{background-color:#ffffff;font-size:14pt}'
 * @public
 */
export function compileStyleObjectToString(styles: ExtendedCSSProperties): string {
  const compiledStyles: Array<string> = []
  for (const rawPropertyKey in styles) {
    const propertyValue = styles[rawPropertyKey]
    const propertyKey = mapPropertyNameFromJSToCSS(rawPropertyKey)
    compiledStyles.push(`${propertyKey}:${normalizeCSSValue(propertyKey, propertyValue)}`)
  }
  return compiledStyles.join(';')
}

const checkedSelectors = IS_DEBUG_ENV ? new Set<string>() : null

/**
 * Uses {@link compileStyleObjectToString} to compile a complete CSS syntax string
 * for one CSS class/selector.
 * @param key - The CSS class/selector.
 * @param styles - The style object.
 * @example
 * compileStyle('.foo', { backgroundColor: '#ffffff' })
 * // Output: '.foo{background-color:#ffffff}'
 * @public
 */
export function compileStyle(key: string, styles: ExtendedCSSProperties): string {
  if (IS_DEBUG_ENV) {
    if (!selectorsToIgnore.current.has('*')) {
      const selectors = key.split(/\s*[\s>+~]\s*/g)
      for (const $selector of selectors) {
        const selector = $selector.replace(/:.+$/, '')
        if (checkedSelectors.has(selector)) { continue }
        if (!tryValidateCSSSelector(selector)) {
          devWarn(`Found unrecognized element "${selector}" when compiling styles. If this was intentional or if it is a valid web component, you can suppress this warning by calling ignoreWhenCompilingStyles(['${selector}'])`)
        }
        checkedSelectors.add(selector)
      }
    }
  }
  return `${key}{${compileStyleObjectToString(styles)}}`
}

/**
 * Uses {@link compileStyle} to compile a complete CSS syntax string from a
 * [`Map`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Map)
 * where each key-value pair is the CSS class/selector and the style object.
 * @example
 * compileStyles(new Map([
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
export function compileStyles(styles: StyleMap): string {
  const compiledStyles: Array<string> = []
  styles.forEach((value, key) => {
    compiledStyles.push(compileStyle(key, value))
  })
  return compiledStyles.join('')
}
