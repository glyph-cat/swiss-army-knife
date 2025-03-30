import { StringRecord } from '@glyph-cat/swiss-army-knife'

export function prefixBasicUIClassNames<S extends StringRecord<string>>(
  subPrefix: string,
  styles: S,
): Readonly<S> {
  const prefixedStyles: StringRecord<string> = {}
  for (const key in styles) {
    prefixedStyles[key] = `gc-basic-${subPrefix}-${styles[key]}`
  }
  return prefixedStyles as S
}
