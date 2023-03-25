import { MutableRefObject } from 'react'
import { handleUnsupportedPlatform } from '../../../__internals__'

/**
 * Allows appending CSS values dynamically to [`document.body`](https://developer.mozilla.org/en-US/docs/Web/API/Document/body).
 * @public
 */
export function useGlobalCSSVariableInjection(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  values: Record<string, number | string>
): void {
  handleUnsupportedPlatform('CSS variable injection')
}

/**
 * Allows appending CSS values dynamically to a HTML element.
 * @public
 */
export function useScopedCSSVariableInjection(
  /* eslint-disable @typescript-eslint/no-unused-vars */
  values: Record<string, number | string>,
  ref: MutableRefObject<HTMLElement>
  /* eslint-enable @typescript-eslint/no-unused-vars */
): void {
  handleUnsupportedPlatform('CSS variable injection')
}
