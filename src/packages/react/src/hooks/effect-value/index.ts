import { Nullable } from '@glyph-cat/swiss-army-knife'
import { useEffect, useLayoutEffect, useState } from 'react'

/**
 * A hooks that returns a value that is only generated after a component mounts.
 * In other words, a client-side generated value.
 * @param getValue - A function that will produce the value.
 * @param deps - React hook dependency array.
 * @param initialValue - The initial value that is safe to use even during server-side rendering.
 * @param removeValue - A function that will perform cleanup on the created value.
 * @returns The client-side generated value.
 * @public
 */
export function useEffectValue<T>(
  getValue: () => T,
  deps: Array<unknown>,
  initialValue: Nullable<T> = null,
  removeValue?: (value: T) => void
): T {
  const [value, setValue] = useState(initialValue)
  useEffect(() => {
    const newValue = getValue()
    setValue(newValue)
    return () => { removeValue?.(newValue) }
  }, [...deps]) // eslint-disable-line react-hooks/exhaustive-deps
  return value
}

/**
 * Similar to {@link useEffectValue} except this hooks uses {@link useLayoutEffect}.
 * @param getValue - A function that will produce the value.
 * @param deps - React hook dependency array.
 * @param initialValue - The initial value that is safe to use even during server-side rendering.
 * @param removeValue - A function that will perform cleanup on the created value.
 * @returns The client-side generated value.
 * @public
 */
export function useLayoutEffectValue<T>(
  getValue: () => T,
  deps: Array<unknown>,
  initialValue: Nullable<T> = null,
  removeValue?: (value: T) => void
): T {
  const [value, setValue] = useState(initialValue)
  useLayoutEffect(() => {
    const newValue = getValue()
    setValue(newValue)
    return () => { removeValue?.(newValue) }
  }, [...deps]) // eslint-disable-line react-hooks/exhaustive-deps
  return value
}
