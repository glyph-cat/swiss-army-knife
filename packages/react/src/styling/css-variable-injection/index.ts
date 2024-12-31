import { injectCSSVariables } from '@glyph-cat/swiss-army-knife'
import { useInsertionEffect } from 'react'

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

