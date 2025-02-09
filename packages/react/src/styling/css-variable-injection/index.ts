import { injectCSSVariables } from '@glyph-cat/swiss-army-knife'
import { useInsertionEffect, useLayoutEffect } from 'react'

/**
 * Allows appending CSS values dynamically to the
 * [style](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/style)
 * property of a HTML element using the
 * [`useInsertionEffect`](https://react.dev/reference/react/useInsertionEffect)
 * hook.
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
 * Allows appending CSS values dynamically to the
 * [style](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/style)
 * property of a HTML element using the
 [`useLayoutEffect`](https://react.dev/reference/react/useLayoutEffect)
 hook.
 * @public
 */
export function useLayoutCSSVariableInjection(
  values: Record<string, number | string>,
  target: HTMLElement
): void {
  useLayoutEffect(() => {
    return injectCSSVariables(values, target)
  }, [target, values])
}

