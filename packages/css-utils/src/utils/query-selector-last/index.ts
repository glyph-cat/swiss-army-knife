import { Nullable } from '@glyph-cat/foundation'

/**
 * Query selector for the last occurring matching element.
 * @public
 */
export function querySelectorLast<T extends Element>(
  element: HTMLElement,
  selector: string,
): Nullable<T> {
  const allMatchingElements = element.querySelectorAll(selector)
  return allMatchingElements.item(allMatchingElements.length - 1) as T
}
