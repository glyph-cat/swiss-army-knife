import { RefObject } from '@glyph-cat/foundation'
import { clientOnly } from '../../../client-only'

export function setupInputFocusTracker(
  documentHasFocusWithinRef: RefObject<boolean>,
  refreshState: () => void,
): void {
  clientOnly(() => {
    // According to MDN, 'focusin' and 'focusout' events are not cancellable.
    // This strategy is compatible with 3rd party complex text editors such as Monaco and Lexical.
    const onFocusIn = () => {
      documentHasFocusWithinRef.current = true
      refreshState()
    }
    const onFocusOut = () => {
      documentHasFocusWithinRef.current = false
      refreshState()
    }
    window.addEventListener('focusin', onFocusIn)
    window.addEventListener('focusout', onFocusOut)
  })
}
