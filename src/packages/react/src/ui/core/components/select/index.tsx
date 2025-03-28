import { addStyles, c, isBoolean, PrecedenceLevel, StyleMap } from '@glyph-cat/swiss-army-knife'
import { createElement, forwardRef, JSX, Ref } from 'react'
import { useCommonFocusableRefHandler } from '../../input-focus'
import { createCoreUIComponentClassName, useInternalDerivedDisabledState } from '../internals'

const BASE_CLASSNAME = createCoreUIComponentClassName('select')

if (typeof window !== 'undefined') {
  addStyles(new StyleMap([[`.${BASE_CLASSNAME}`, {
    fontFamily: 'inherit'
  }]]).compile(), PrecedenceLevel.INTERNAL)
}

/**
 * @public
 */
export type SelectProps = JSX.IntrinsicElements['select']

/**
 * @public
 */
export interface Select extends HTMLSelectElement { (props: SelectProps): JSX.Element }

/**
 * A drop-in replacement for the `<select>` element.
 * Reasons:
 * - Easy to track and check if any similar elements sharing
 *   the same {@link InputFocusTracker} are in focus.
 * - This can be used to prevent keyboard shortcuts from being triggered when
 *   the textarea is in focus.
 * - Component can be disabled as a group with other components that share
 *   the same {@link DisabledContext}.
 * @public
 */
export const Select = forwardRef(({
  children,
  className,
  disabled: $disabled,
  ...props
}: SelectProps, ref: Ref<HTMLSelectElement>) => {
  const selectRef = useCommonFocusableRefHandler(props, ref)
  const disabled = useInternalDerivedDisabledState($disabled)
  return createElement('select', {
    ...props,
    ref: selectRef,
    className: c(BASE_CLASSNAME, className),
    ...(isBoolean(disabled) ? { disabled } : {}),
  }, children)
})
