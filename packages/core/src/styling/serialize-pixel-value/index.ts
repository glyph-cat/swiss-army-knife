import { isNumber } from '../../data'

const keywordsPattern = /(gap|height|margin|padding|radius|size|spacing|width)/i

/**
 * Converts number to pixel string, and leaves string values untouched.
 * @param value - The value to serialize.
 * @returns The serialized value.
 * @example
 * serializePixelValue('fontSize', 14)     // '14px'
 * serializePixelValue('fontSize', '14pt') // '14pt'
 * serializePixelValue('opacity', 1)       // 1
 * @public
 */
export function serializePixelValue(
  attributeKey: string,
  attributeValue: string | number
): string | number {
  if (isNumber(attributeValue) && keywordsPattern.test(attributeKey)) {
    return `${attributeValue}px`
  } else {
    return attributeValue
  }
}
