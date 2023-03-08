import { MutableRefObject } from 'react'
import { devWarn } from '../../../dev'

/**
 * Allows appending CSS values dynamically to [`document.body`](https://developer.mozilla.org/en-US/docs/Web/API/Document/body).
 * @public
 */
export function useGlobalCSSVariableInjection(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  values: Record<string, number | string>
): void {
  devWarn('CSS variable injection is not supported in React Native')
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
  devWarn('CSS variable injection is not supported in React Native')
}
