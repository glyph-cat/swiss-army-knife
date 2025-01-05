import { RefObject } from '@glyph-cat/swiss-army-knife'
import { useState } from 'react'

/**
 * @public
 */
export function useLazyRef<T>(factory: () => T): RefObject<T> {
  const [ref] = useState<RefObject<T>>(() => ({ current: factory() }))
  return ref
}
