import { isFunction } from '@glyph-cat/type-checking'
import { useRef } from 'react'

/**
 * A better replacement for declaring constants with `useState` or `useMemo`
 * with an empty dependency list.
 *
 * ---
 *
 * Regex for searching `useState` for ease of replacement: `\[[a-z0-9_-]+\]\s?=\s?useState`
 * - This will match code patterns such as:
 * ```js
 * const [someConstant] = useState(() => ...)
 * ```
 * @public
 */
export function useConstant<T>(valueOrFactory: T | (() => T)): T {
  const isInitialized = useRef(false)
  const value = useRef<T>(null)
  if (!isInitialized.current) {
    if (isFunction(valueOrFactory)) {
      value.current = valueOrFactory()
    } else {
      value.current = valueOrFactory
    }
    isInitialized.current = true
  }
  return value.current
}
