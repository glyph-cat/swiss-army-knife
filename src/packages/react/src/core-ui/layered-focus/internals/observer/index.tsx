import { isString, RefObject } from '@glyph-cat/swiss-army-knife'
import { JSX, useContext, useLayoutEffect } from 'react'
import { useCoreUIContext } from '../../../context'
import { IFocusNode } from '../registration-reducers'

const DATA_FOCUSED = 'data-focused'

export function FocusObserver({
  elementRef,
  allowRefocus,
}: FocusObserverProps): JSX.Element {
  const { layeredFocusManager } = useCoreUIContext()
  // NOTE: context is always expected to have a value in this scenario
  const context = useContext(layeredFocusManager.M$context)
  const isFocused = getFocusedStateFromContext(context, true)
  const { id, parentNode, ignoreSiblings } = context

  useLayoutEffect(() => {
    if (isFocused) {
      const element = elementRef.current
      element.setAttribute(DATA_FOCUSED, String(isFocused))
      return () => { element.removeAttribute(DATA_FOCUSED) }
    }
  }, [elementRef, isFocused])

  // NOTE: Every <FocusLayer> will have a parent node.
  // In the most basic scenario, the parent will be the <FocusRoot>.
  // The only time when parent node is undefined is when trying to access
  // the <FocusRoot> directly, which is not how the <FocusObserver> is
  // meant to be used —— it should always be nested in a <FocusLayer>.
  const parentSetFocus = parentNode.setFocus
  useLayoutEffect(() => {
    if (!allowRefocus || ignoreSiblings) { return } // Early exit
    const onMouseDown = () => { parentSetFocus(id, ignoreSiblings) }
    const target = elementRef.current
    target.addEventListener('mousedown', onMouseDown)
    return () => { target.removeEventListener('mousedown', onMouseDown) }
  }, [allowRefocus, elementRef, id, ignoreSiblings, parentSetFocus])

  return null

}

export interface FocusObserverProps {
  elementRef: RefObject<HTMLElement>
  allowRefocus: boolean
}

export function getFocusedStateFromContext(
  context: IFocusNode,
  enforceContextPresence: boolean,
): boolean {
  if (!context && !enforceContextPresence) { return true } // Early exit
  if (isString(context.focusedChild)) { return false } // Early exit
  if (context.parentNode) {
    return Object.is(context.parentNode.focusedChild, context.id) || context.ignoreSiblings
    // Early exit
  }
  return true
}
