import { Empty } from '@glyph-cat/foundation'
import { isNullOrUndefined } from '@glyph-cat/type-checking'
import { serializePixelValue } from '../serialize-pixel-value'

const numericKeywordsPattern = /(gap|height|margin|padding|position|radius|size|spacing|width)/i

/**
 * Normalizes CSS values into strings. If it is a size-type property such as width,
 * then the value will be appended with `'px'`. If it is other property such as opacity,
 * then the value will be converted into a string directly. If a value is already
 * a string type, then it is returned as-is.
 * @param value - The value to normalize.
 * @returns The normalized value.
 * @example
 * normalizeCSSValue('fontSize', 14)     // '14px'
 * normalizeCSSValue('fontSize', '14pt') // '14pt'
 * normalizeCSSValue('opacity', 1)       // '1'
 * @public
 */
export function normalizeCSSValue(
  attributeKey: string,
  attributeValue: string | number | undefined,
): string {
  if (isNullOrUndefined(attributeValue)) {
    return Empty.STRING
  }
  if (numericKeywordsPattern.test(attributeKey)) {
    return serializePixelValue(attributeValue)
  } else {
    return String(attributeValue)
  }
}
