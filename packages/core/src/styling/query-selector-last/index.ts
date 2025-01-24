/**
 * Query selector for the last occurring matching element.
 * @public
 */
export function querySelectorLast<T extends Element>(
  element: HTMLElement,
  selector: string,
): T {
  const allMatchingElements = element.querySelectorAll(selector)
  return allMatchingElements.item(allMatchingElements.length - 1) as T
}
