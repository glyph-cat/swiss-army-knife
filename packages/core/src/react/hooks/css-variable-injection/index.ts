import { useInsertionEffect } from 'react'
import { isNumber } from '../../../data'
import { CleanupFunction } from '../../../types'

/**
 * Allows appending CSS values dynamically to the [style](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/style) property of a HTML element.
 * @public
 */
export function useCSSVariableInjection(
  values: Record<string, number | string>,
  target: HTMLElement
): void {
  useInsertionEffect(() => {
    return injectCSSVariables(values, target)
  }, [target, values])
}

/**
 * Injects CSS variables into a HTML element.
 * @param values - The values to be injected
 * @param target - The HTML element to be injected with the values
 * @returns A cleanup function that removes the injected values from the HTML element.
 * @public
 */
export function injectCSSVariables(
  values: Record<string, number | string>,
  target: HTMLElement
): CleanupFunction {
  for (const key in values) {
    const value = values[key]
    const safeValue: string = isNumber(value) ? `${value}px` : value
    target.style.setProperty(`--${key}`, safeValue)
  }
  return () => {
    for (const key in values) {
      target.style.removeProperty(`--${key}`)
    }
  }
}