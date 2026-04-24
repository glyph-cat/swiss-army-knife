import { watchNavigatorState } from '@glyph-cat/swiss-army-knife'
import { useEffect } from 'react'

/**
 * @public
 */
export function useWatchNavigatorState(): void {
  useEffect(watchNavigatorState, [])
}
