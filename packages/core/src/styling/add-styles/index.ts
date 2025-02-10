import { RefObject } from '../../data/ref'
import { CleanupFunction } from '../../types'
import {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  compileStyles,
} from '../compile-styles'
import { querySelectorLast } from '../query-selector-last'
import {
  DATA_PRECEDENCE_LEVEL,
  PrecedenceLevel,
  QUERY_SELECTOR_PRECEDENCE_LEVEL_INTERNAL,
  QUERY_SELECTOR_PRECEDENCE_LEVEL_LOW,
} from './constants'

/**
 * Appends styles to [`document.head`](https://developer.mozilla.org/docs/Web/HTML/Element/head)
 * using the [`<style>`](https://developer.mozilla.org/docs/Web/HTML/Element/style) element.
 * @param styles - Styles written as plain CSS string. Consider using {@link compileStyles} to generate the string from a JavaScript object for better readability and code maintainability.
 * @param precedenceLevel - Precedence level of the stylesheet.
 * @returns A callback function that when called, removes the appended styles.
 * @public
 */
export function addStyles(
  styles: string,
  precedenceLevel?: PrecedenceLevel,
  styleElementRef?: RefObject<HTMLStyleElement>,
): CleanupFunction {
  precedenceLevel ??= PrecedenceLevel.HIGH
  const styleElement = document.createElement('style')
  styleElement.innerHTML = styles
  styleElement.setAttribute(DATA_PRECEDENCE_LEVEL, String(precedenceLevel))
  if (styleElementRef) {
    styleElementRef.current = styleElement
  }
  if (precedenceLevel === PrecedenceLevel.INTERNAL) {
    const lastOccurringInternalPriorityElement = querySelectorLast(
      document.head,
      QUERY_SELECTOR_PRECEDENCE_LEVEL_INTERNAL,
    )
    if (lastOccurringInternalPriorityElement) {
      lastOccurringInternalPriorityElement.insertAdjacentElement('afterend', styleElement)
    } else {
      // This also takes styles of other precedence levels into consideration already:
      const firstOccurringStyleElement = document.head.querySelector([
        'style',
        'link[rel="stylesheet"]',
        'link[rel="preload"][as="style"]',
      ].join(','))
      document.head.insertBefore(styleElement, firstOccurringStyleElement)
    }
  } else if (precedenceLevel === PrecedenceLevel.LOW) {
    const lastOccurringLowPriorityElement = querySelectorLast(
      document.head,
      QUERY_SELECTOR_PRECEDENCE_LEVEL_LOW,
    )
    if (lastOccurringLowPriorityElement) {
      lastOccurringLowPriorityElement.insertAdjacentElement('afterend', styleElement)
    } else {
      const firstOccurringStyleElement = document.head.querySelector([
        `style:not([${DATA_PRECEDENCE_LEVEL}^="${PrecedenceLevel.INTERNAL}"])`,
        'link[rel="stylesheet"]',
        'link[rel="preload"][as="style"]',
      ].join(','))
      document.head.insertBefore(styleElement, firstOccurringStyleElement)
    }
  } else {
    // Remaining condition - `PrecedenceLevel.HIGH`
    document.head.append(styleElement)
  }
  return () => {
    if (styleElementRef) {
      styleElementRef.current = null
    }
    styleElement.remove()
  }
}

// References (querySelector):
// - https://stackoverflow.com/a/56328426/5810737
// - https://stackoverflow.com/a/10777783/5810737

// #region Other exports
export * from './constants/public'
// #endregion Other exports

// KIV: [low priority] Not sure if there is a need to reate a class that is built on top of `addStyles` instead to enabled editing style contents?
