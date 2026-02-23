import { CleanupFunction, createRef } from '@glyph-cat/foundation'
import { ReadOnlyStateManager, SimpleStateManager } from 'cotton-box'
import { setupInputFocusTracker } from './setup'

// Goal: to help block custom shortcut keys from being triggered since they are
// not relevant to the text input.

// It doesn't seem like `addEventListener('blur', () => { })` on a component directly
// will be triggered when it is unmounted, the strategy of observing the document
// instead does not come with this problem.

const documentHasFocusWithinRef = createRef(false)
const manualTrackers = new Set<string | symbol>()

/**
 * A simple state manager that keep track of whether any input elements are in focus.
 * @public
 */
export const AnyInputFocusState = new SimpleStateManager(false) as ReadOnlyStateManager<boolean>

function refreshState(): void {
  (AnyInputFocusState as SimpleStateManager<boolean>).set(
    documentHasFocusWithinRef.current || manualTrackers.size > 0
  )
}

setupInputFocusTracker(documentHasFocusWithinRef, refreshState)

/**
 * @param componentId - A unique identifier that represents the component being in focus.
 * If omitted, a unique symbol is internally generated.
 * @returns A cleanup function that when called, will register the component as being unfocused.
 * The cleanup function is identical to calling {@link manuallyRegisterInputBlur|`manuallyRegisterInputBlur(componentId)`}.
 * @example
 * // Setup
 * const registerBlur = manuallyRegisterInputFocus(componentId)
 * // Cleanup
 * manuallyRegisterInputBlur(componentId)
 * // Cleanup (alternative)
 * registerBlur()
 * @public
 */
export function manuallyRegisterInputFocus(componentId?: string | symbol): CleanupFunction {
  componentId ||= Symbol()
  manualTrackers.add(componentId)
  refreshState()
  return () => { manuallyRegisterInputBlur(componentId) }
}

/**
 * @param componentId - A unique identifier that represents the component being in focus.
 * @example
 * manuallyRegisterInputBlur(componentId)
 * @public
 */
export function manuallyRegisterInputBlur(componentId: string | symbol): void {
  manualTrackers.delete(componentId)
  refreshState()
}
