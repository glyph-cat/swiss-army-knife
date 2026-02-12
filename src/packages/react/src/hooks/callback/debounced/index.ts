import { useCallback, useEffect, useRef } from 'react'

/**
 * Debounce utility hook.
 * @param callback - The callback to debounce.
 * @param timeout - The duration of debounce in milliseconds. Defaults to `100`.
 * @returns A "wrapper" callback that when invoked, forwards the arguments to
 * the original callback, but with a debounce.
 * @example
 * const debouncedCallback = useDebouncedCallback(doSomething, 300)
 * @example
 * const debouncedCallback = useDebouncedCallback(() => {
 *   // custom function body
 * }, 300)
 * @public
 */
export function useDebouncedCallback<C extends (...args: any[]) => unknown>(
  callback: C,
  timeout = 100,
): (...args: Parameters<C>) => void {

  const paramsRef = useRef<[C, number]>(null!)
  paramsRef.current = [callback, timeout]

  const timeoutRef = useRef<ReturnType<typeof setTimeout>>(null!)
  useEffect(() => () => { clearTimeout(timeoutRef.current) }, [])

  return useCallback((...args: Parameters<C>) => {
    clearTimeout(timeoutRef.current)
    const [$callback, $timeout] = paramsRef.current
    timeoutRef.current = setTimeout(() => {
      $callback(...args)
    }, $timeout)
  }, []) as C

}
