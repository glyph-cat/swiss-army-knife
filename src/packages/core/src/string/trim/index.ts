/**
 * Removes any leading and trailing whitespaces, tabs, or empty lines from a string.
 * @param value - The string to be trimmed.
 * @returns The trimmed string.
 * @example
 * Sanitize.toString('  \t foo bar\n\n') // 'foo bar'
 * @public
 */
export function trim(value: string): string {
  return value.replace(/^[\s\n\t]+/, '').replace(/[\s\n\t]+$/, '')
}

/**
 * Removes any leading and trailing whitespaces, tabs, or empty lines from a string
 * on a multiline basis.
 * @param value - The string to be trimmed.
 * @returns The trimmed string.
 * @public
 */
export function multilineTrim(value: string): string {
  const newValueStack: Array<string> = []
  const lines = value.split(/\n/g)
  for (const line of lines) {
    newValueStack.push(trim(line))
  }
  return trim(newValueStack.join('\n'))
}

// TODO: Consider adding an option or variant that also removes invisible characters such as the zero width non joiner?
