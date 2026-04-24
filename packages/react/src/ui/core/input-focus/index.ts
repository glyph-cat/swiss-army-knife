import { AnyInputFocusState } from '@glyph-cat/swiss-army-knife'
import { useSimpleStateValue } from 'cotton-box-react'

/**
 * @returns `true` if there are any input/textarea/select elements that are in focus.
 * @example
 * const isAnyInputFocused = useAnyInputFocusState()
 * @public
 */
export function useAnyInputFocusState(): boolean {
  return useSimpleStateValue(AnyInputFocusState)
}
