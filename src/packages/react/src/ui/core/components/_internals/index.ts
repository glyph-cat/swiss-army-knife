import { addStyles, Nullable, PrecedenceLevel, StyleMap } from '@glyph-cat/swiss-army-knife'
import { clientOnly } from '../../../../../../core/src/client-only'
import { useDerivedDisabledState } from '../../disabled-context'
import { useLayeredFocusState } from '../../layered-focus'

export function useInternalDerivedDisabledState(disabled: boolean): Nullable<boolean> {
  const [isFocused] = useLayeredFocusState()
  // Focusability takes precedence, if not focused, then element should be disabled,
  // even if the props specifies `disabled=false`.
  // Semantically speaking, we can only enforce `disabled=false` to ignore
  // the <DisabledContext> but not the Layered Focus State.
  // If we want to enforce `disabled=false` by ignoring layer focus,
  // then the button should be placed in a different <FocusLayer>.
  return useDerivedDisabledState(isFocused ? disabled : true)
}

const createClassName = (name: string): string => `gc-core-ui-${name}`

export const VIEW_STYLES = createClassName('view')
export const BUTTON_STYLES = createClassName('button')
export const INPUT_STYLES = createClassName('input')
export const SELECT_STYLES = createClassName('select')
export const FIELDSET_STYLES = createClassName('fieldset')

clientOnly(() => {
  addStyles(new StyleMap([
    [`.${VIEW_STYLES}`, {
      display: 'grid',
      position: 'relative',
    }],
    [`.${BUTTON_STYLES}`, {
      appearance: 'none',
      border: 'none',
      backgroundColor: 'transparent',
      display: 'grid',
      margin: 0,
      outline: 'none',
      padding: 0,
      placeItems: 'center',
      position: 'relative',
    }],
    [`.${INPUT_STYLES}`, {
      backgroundColor: 'transparent',
      border: 'none',
      display: 'grid',
      fontFamily: 'inherit',
      margin: 0,
      outline: 'none',
      padding: 0,
    }],
    [`.${SELECT_STYLES}`, {
      fontFamily: 'inherit'
    }],
    [`.${FIELDSET_STYLES}`, {
      fontFamily: 'inherit'
    }],
  ]).compile(), PrecedenceLevel.INTERNAL)
})
