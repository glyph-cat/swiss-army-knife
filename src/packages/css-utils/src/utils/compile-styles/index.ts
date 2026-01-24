import { StringRecord } from '@glyph-cat/foundation'
import autoprefixer from 'autoprefixer'
import postcss from 'postcss'
import { __getDisplayName } from '../../_internals'
import { CSSPropertiesExtended, CustomCSSVariablesRecord } from '../../abstractions'
import { IS_DEBUG_ENV } from '../../constants'
import { mapPropertyNameFromJSToCSS } from '../map-property-name'
import { normalizeCSSValue } from '../normalize-css-value'
import { tryFormatAsClassName } from '../try-format-as-class-name'
import { ignoreWhenCompilingStyles, selectorsToIgnore, tryValidateCSSSelector } from './validator'

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
  styles: CSSPropertiesExtended,
): StringRecord<CSSPropertiesExtended[keyof CSSPropertiesExtended]> {
  const compiledStyles: StringRecord<CSSPropertiesExtended[keyof CSSPropertiesExtended]> = {}
  for (const rawPropertyKey in styles) {
    const propertyValue = styles[rawPropertyKey]
    const propertyKey = mapPropertyNameFromJSToCSS(rawPropertyKey)
    compiledStyles[propertyKey] = normalizeCSSValue(propertyKey, propertyValue)
  }
  return compiledStyles
}

const autoprefixerInstance = autoprefixer({
  grid: 'autoplace',
  overrideBrowserslist: process.env.NODE_ENV === 'production'
    ? [
      '>0.5%',
      'not dead',
      'not op_mini all',
    ]
    : [
      'last 3 chrome version',
      'last 3 firefox version',
      'last 5 safari version',
    ],
})

const postcssInstance = postcss([autoprefixerInstance])

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
export function compileStyleObjectToString(styles: CSSPropertiesExtended): string {
  const compiledStyles: Array<string> = []
  for (const rawPropertyKey in styles) {
    const propertyValue = styles[rawPropertyKey]
    const propertyKey = mapPropertyNameFromJSToCSS(rawPropertyKey)
    compiledStyles.push(`${propertyKey}:${normalizeCSSValue(propertyKey, propertyValue)}`)
  }
  return postcssInstance.process(compiledStyles.join(';')).css
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
export function compileStyle(key: string, styles: CSSPropertiesExtended): string {
  if (IS_DEBUG_ENV) {
    if (!selectorsToIgnore.current.has('*')) {
      const selectors = key.split(/\s*[\s>+~,]\s*/g)
      for (const $selector of selectors) {
        const selector = $selector.replace(/:.+$/, '')
        if (checkedSelectors.has(selector)) { continue }
        if (!tryValidateCSSSelector(selector)) {
          console.warn(`Found unrecognized element "${selector}" when compiling styles. If this was intentional or if it is a valid web component, you can suppress this warning by calling ${__getDisplayName(ignoreWhenCompilingStyles)}(['${selector}'])`)
        }
        checkedSelectors.add(selector)
      }
    }
  }
  return `${key}{${compileStyleObjectToString(styles)}}`
}

/**
 * Transforms an object containing values that are assumed to be CSS variables,
 * into a one-line string.
 * @param values - An object containing the custom values.
 * @param identifier - Can be a CSS class name or ID or selectors such as `':root'`. The leading dot can be omitted when it is a CSS class name.
 * @example
 * // Without identifier
 * compileCSSVariables({ size: 36, duration: '300ms', color: '#00ff00' })
 * // --size:36px;--duration:300ms;--color:#00ff00
*
 * // Without identifier:
 * compileCSSVariables({ size: 36, duration: '300ms', color: '#00ff00' }, 'foo')
 * // .foo{--size:36px;--duration:300ms;--color:#00ff00}
 * @public
 */
export function compileCSSVariables(values: CustomCSSVariablesRecord, identifier?: string): string {
  const styles: Array<string> = []
  for (const key in values) {
    const value = values[key]
    styles.push(`--${key}:${normalizeCSSValue(key, value)}`)
  }
  const concatenatedValues = styles.join(';')
  return identifier ? `${tryFormatAsClassName(identifier)}{${concatenatedValues}}` : concatenatedValues
}
