import { Nullable } from '@glyph-cat/swiss-army-knife'
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

export function createCoreUIComponentClassName(name: string): string {
  return `gc-core-ui-${name}`
}
