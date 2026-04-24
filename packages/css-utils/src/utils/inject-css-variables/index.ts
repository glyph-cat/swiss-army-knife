import { Charset, CleanupFunction } from '@glyph-cat/foundation'
import { pickRandom } from '../../../../core/src/random/pick'
import { CustomCSSVariablesRecord } from '../../abstractions'
import { addStyles, PrecedenceLevel } from '../add-styles'
import { compileCSSVariables } from '../compile-styles'
import { normalizeCSSValue } from '../normalize-css-value'

const leadingCSSVariableDashPattern = /^--/

/**
 * Injects CSS variables into a HTML element using inline style.
 * @param values - The values to be injected.
 * @param target - The HTML element to be injected with the values.
 * @returns A cleanup function that removes the injected values from the HTML element.
 * @public
 */
export function injectInlineCSSVariables(
  values: CustomCSSVariablesRecord,
  target: HTMLElement,
): CleanupFunction {
  const normalizedKeys: Array<string> = []
  for (const key in values) {
    const value = values[key]
    const normalizedKey = leadingCSSVariableDashPattern.test(key) ? key : `--${key}`
    normalizedKeys.push(normalizedKey)
    // NOTE: `serializePixelValue` will make a smart guess on whether
    // the variables need to have 'px' appended to them as suffix.
    target.style.setProperty(normalizedKey, normalizeCSSValue(key, value))
  }
  return () => {
    for (const normalizedKey of normalizedKeys) {
      target.style.removeProperty(normalizedKey)
    }
  }
}

/**
 * Injects CSS variables into a HTML element by appending a class name to it.
 * @param values - The custom CSS values to inject.
 * @param target - The target HTML element to inject the values at.
 * @param precedenceLevel - Precedence level of the stylesheet.
 * @returns A cleanup function that removes the injected values from the HTML element.
 * @public
 */
export function injectCSSVariables(
  values: CustomCSSVariablesRecord,
  target?: HTMLElement,
  precedenceLevel: PrecedenceLevel = PrecedenceLevel.HIGH,
): CleanupFunction {
  const className = createClassName()
  const compiledVariables = compileCSSVariables(values, className)
  const removeStyles = addStyles(compiledVariables, precedenceLevel)
  target ??= document.body
  target.classList.add(className)
  return () => {
    target.classList.remove(className)
    removeStyles()
  }
}

function createClassName(): string {
  let newClassName = pickRandom(Charset.ALPHABET_LOWER) // prefix charset
  while (newClassName.length < 12) { // arbitrary length
    newClassName += pickRandom(Charset.DEFAULT) // body charset
  }
  return newClassName
}
