import { UnsupportedPlatformError } from '@glyph-cat/swiss-army-knife'

/**
 * Allows appending CSS values dynamically to the [style](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/style) property of a HTML element.
 * @public
 */
export function useCSSVariableInjection(
  /* eslint-disable @typescript-eslint/no-unused-vars */
  values: Record<string, number | string>,
  target: HTMLElement
  /* eslint-enable @typescript-eslint/no-unused-vars */
): void {
  throw new UnsupportedPlatformError()
}
