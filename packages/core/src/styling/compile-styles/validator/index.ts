import { IS_DEBUG_ENV } from '../../../constants'
import { HTML_ELEMENT_TAGS } from '../../../html'
import { StringRecord } from '../../../types'

export const selectorsToIgnore = IS_DEBUG_ENV ? new Set<string>() : null
export const selectorPatternsToIgnore: Array<RegExp> = IS_DEBUG_ENV ? [] : null
export const validatedSelectors: StringRecord<boolean> = IS_DEBUG_ENV ? {} : null

export function tryValidateCSSSelector(value: string): boolean {
  if (!IS_DEBUG_ENV) { return true }
  if (/^(\.|#)/.test(value) || HTML_ELEMENT_TAGS.has(value) || selectorsToIgnore.has(value)) {
    return true // Early exit
  }
  for (const pattern of selectorPatternsToIgnore) {
    if (pattern.test(value)) {
      return true // Early exit
    }
  }
  return false
}
