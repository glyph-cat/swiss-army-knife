import { IS_DEBUG_ENV } from '../../constants'
import { isString } from '../../data'
import { devWarn } from '../../dev'
import { StringRecord } from '../../types'
import { ExtendedCSSProperties } from '../abstractions'
import { mapPropertyNameFromJSToCSS } from '../map-property-name'
import { serializePixelValue } from '../serialize-pixel-value'
import { selectorPatternsToIgnore, selectorsToIgnore, tryValidateCSSSelector } from './validator'

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
  styleObject: ExtendedCSSProperties
): StringRecord<ExtendedCSSProperties[keyof ExtendedCSSProperties]> {
  const compiledStyles: StringRecord<ExtendedCSSProperties[keyof ExtendedCSSProperties]> = {}
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
export function compileStyleObjectToString(styleObject: ExtendedCSSProperties): string {
  const compiledStyles: Array<string> = []
  for (const rawPropertyKey in styleObject) {
    const propertyValue = styleObject[rawPropertyKey]
    const propertyKey = mapPropertyNameFromJSToCSS(rawPropertyKey)
    compiledStyles.push(`${propertyKey}:${serializePixelValue(propertyKey, propertyValue)}`)
  }
  return compiledStyles.join(';')
}

const checkedSelectors = IS_DEBUG_ENV ? new Set<string>() : null

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
export function compileStyles(styles: Map<string, ExtendedCSSProperties>): string {
  const compiledStyles: Array<string> = []
  styles.forEach((value, key) => {
    if (IS_DEBUG_ENV) {
      if (!selectorsToIgnore.has('*')) {
        const selectors = key.split(/\s*[\s>+~]\s*/g)
        for (const $selector of selectors) {
          const selector = $selector.replace(/:.+$/, '')
          if (checkedSelectors.has(selector)) { continue }
          if (!tryValidateCSSSelector(selector)) {
            devWarn(`Found unrecognized element "${selector}" when compiling styles. If this was intentional or if it is a valid web component, you can suppress this warning by calling ${ignoreWhenCompilingStyles.name}(['${selector}'])`)
          }
          checkedSelectors.add(selector)
        }
      }
    }
    compiledStyles.push(`${key}{${compileStyleObjectToString(value)}}`)
  })
  return compiledStyles.join('')
}

/**
 * Whitelist CSS selectors and web components so that warnings are not shown
 * for them when using with {@link compileStyles}. Optionally, pass a single `'*'`
 * to turn off this checking feature.
 * @public
 */
export function ignoreWhenCompilingStyles(
  ...selectors: Array<string | RegExp>
): void {
  if (!IS_DEBUG_ENV) { return } // Early exit
  for (const selector of selectors) {
    if (isString(selector)) {
      selectorsToIgnore.add(selector)
    } else {
      selectorPatternsToIgnore.push(selector)
    }
  }
}
