import { CleanupFunction } from '../../types'
import { ExtendedCSSProperties } from '../abstractions'
import { serializePixelValue } from '../serialize-pixel-value'

/**
 * Injects CSS variables into a HTML element.
 * @param values - The values to be injected
 * @param target - The HTML element to be injected with the values
 * @returns A cleanup function that removes the injected values from the HTML element.
 * @public
 */
export function injectCSSVariables(
  values: Record<string, ExtendedCSSProperties[keyof ExtendedCSSProperties]>,
  target: HTMLElement
): CleanupFunction {
  for (const key in values) {
    const value = values[key]
    // NOTE: By using `serializePixelValue` we make a smart guess on whether
    // the variables need to have 'px' appended to them as suffix.
    serializePixelValue(key, value)
    target.style.setProperty(`--${key}`, String(serializePixelValue(key, value)))
  }
  return () => {
    for (const key in values) {
      target.style.removeProperty(`--${key}`)
    }
  }
}
