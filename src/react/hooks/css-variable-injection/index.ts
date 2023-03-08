import { MutableRefObject, useInsertionEffect } from 'react'
import { forEachInObject, isNumber } from '../../../data'
import { devError } from '../../../dev'
import { useLayoutEffect } from '../isomorphic-layout-effect'
import { useRef } from '../lazy-ref'

const globalKeyCache: Record<string, true> = {}

/**
 * Allows appending CSS values dynamically to [`document.body`](https://developer.mozilla.org/en-US/docs/Web/API/Document/body).
 * @public
 */
export function useGlobalCSSVariableInjection(
  values: Record<string, number | string>
): void {
  useInsertionEffect(() => {
    forEachInObject(values, ({ key, value }) => {
      if (globalKeyCache[key]) {
        devError(`Conflicting (global) CSS variable name '${key}'`)
      }
      globalKeyCache[key] = true
      const safeValue: string = isNumber(value) ? `${value}px` : value
      document.body.style.setProperty(`--${key}`, safeValue)
    })
    return () => {
      forEachInObject(values, ({ key }) => {
        document.body.style.removeProperty(`--${key}`)
        delete globalKeyCache[key]
      })
    }
  }, [values])
}

/**
 * Allows appending CSS values dynamically to a HTML element.
 * @public
 */
export function useScopedCSSVariableInjection(
  values: Record<string, number | string>,
  ref: MutableRefObject<HTMLElement>
): void {
  const scopedKeyCache = useRef<Record<string, true>>({})
  useLayoutEffect(() => {
    forEachInObject(values, ({ key, value }) => {
      if (scopedKeyCache.current[key]) {
        devError(`Conflicting (scoped) CSS variable name '${key}'`)
      }
      scopedKeyCache.current[key] = true
      const safeValue: string = isNumber(value) ? `${value}px` : value
      ref.current.style.setProperty(`--${key}`, safeValue)
    })
    const ref_current = ref.current
    const scopedKeyCache_current = scopedKeyCache.current
    return () => {
      forEachInObject(values, ({ key }) => {
        ref_current.style.removeProperty(`--${key}`)
        delete scopedKeyCache_current[key]
      })
    }
  }, [ref, values])
}
