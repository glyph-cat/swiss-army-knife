import { createRef, HTML_ELEMENT_TAGS } from '@glyph-cat/foundation'
import { isString } from '@glyph-cat/type-checking'
import { __setDisplayName } from '../../../_internals'
import { IS_DEBUG_ENV } from '../../../constants'

export const selectorPatternsToIgnore = createRef<Array<RegExp>>(null)
export const selectorsToIgnore = createRef<Set<string>>(null)

if (IS_DEBUG_ENV) {
  selectorPatternsToIgnore.current = []
  selectorsToIgnore.current = new Set<string>()
}

export function tryValidateCSSSelector(value: string): boolean {
  if (!IS_DEBUG_ENV) { return true }
  if (/^(\.|#)/.test(value) || HTML_ELEMENT_TAGS.has(value) || selectorsToIgnore.current.has(value)) {
    return true // Early exit
  }
  for (const pattern of selectorPatternsToIgnore.current) {
    if (pattern.test(value)) {
      return true // Early exit
    }
  }
  return false
}

/**
 * Whitelist CSS selectors and web components so that warnings are not shown
 * for them when using with `compileStyle` or `StyleMap.toString`.
 * These warnings will only be shown in development environment.
 * Optionally, pass a single `'*'` to turn off this checking feature.
 * @public
 */
export function ignoreWhenCompilingStyles(
  ...selectors: Array<string | RegExp>
): void {
  if (!IS_DEBUG_ENV) { return } // Early exit
  for (const selector of selectors) {
    if (isString(selector)) {
      selectorsToIgnore.current.add(selector)
    } else {
      selectorPatternsToIgnore.current.push(selector)
    }
  }
}

__setDisplayName(ignoreWhenCompilingStyles)
