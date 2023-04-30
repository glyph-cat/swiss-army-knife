/**
 * Concatenates CSS class names into a string. Falsy values will be ignored.
 * @public
 */
export function concatClassNames(...classNames: Array<string>): string {
  return classNames.filter((className) => !!className)
    .join(' ')
    .trim()
    .replace(/\s+/g, ' ')
}
