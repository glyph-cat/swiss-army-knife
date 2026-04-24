/**
 * Try to format the identifier as a CSS classname by appending a dot
 * to the front of the string.
 * @param identifier - The CSS identifier.
 * @returns The identifier with a leading dot if it starts with an alphabet.
 * @public
 */
export function tryFormatAsClassName(identifier: string): string {
  return /^[a-z]/.test(identifier) ? `.${identifier}` : identifier
}
