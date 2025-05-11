export function prefixBasicUIIdentifiers<S extends string>(
  subPrefix: string,
  classNames: Array<S>,
): Readonly<Record<S, string>> {
  const prefixedStyles = {} as Record<S, string>
  for (const className of classNames) {
    prefixedStyles[className] = `gc-basic-${subPrefix}-${className}`
  }
  return prefixedStyles
}
