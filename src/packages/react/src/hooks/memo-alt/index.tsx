import { arrayIsShallowEqual } from '@glyph-cat/equality'
import { memoize } from '@glyph-cat/swiss-army-knife'
import { DependencyList, useRef } from 'react'
import { useConstant } from '../constant'

/**
 * An alternative to {@link https://react.dev/reference/react/useMemo|`useMemo`}
 * but with a third optional parameter that allows custom dependency list comparison.
 * @param factory - The factory function.
 * @param deps - The dependency list.
 * @param isEqual - The function that evaluates whether the dependency list from
 * the previous and next renders are equal. It does not need to be wrapped in
 * [`useCallback`](https://react.dev/reference/react/useCallback)
 * but it is also expected that by design, the comparison logic should _never_ change.
 * The default is {@link arrayIsShallowEqual|`arrayIsShallowEqual`}
 * from `@glyph-cat/equality`.
 * @returns The memoized value.
 * @public
 */
export function useMemoAlt<T, Deps extends DependencyList>(
  factory: () => T,
  deps: Deps,
  isEqual?: (a: Deps, b: Deps) => boolean,
): T {
  const factoryRef = useRef<typeof factory>(null)
  factoryRef.current = factory
  // Need to pass factory by reference, else first version of factory
  // will be used even when deps change.
  const runFactory = useConstant(() => memoize(
    () => factoryRef.current(),
    isEqual as typeof arrayIsShallowEqual,
  ))
  return runFactory(...deps)
}
