import { addStyles, c, isBoolean, PrecedenceLevel, StyleMap } from '@glyph-cat/swiss-army-knife'
import { createElement, forwardRef, JSX, Ref } from 'react'
import { createCoreUIComponentClassName, useInternalDerivedDisabledState } from '../internals'

const BASE_CLASSNAME = createCoreUIComponentClassName('button')

if (typeof window !== 'undefined') {
  addStyles(new StyleMap([[`.${BASE_CLASSNAME}`, {
    appearance: 'none',
    border: 'none',
    backgroundColor: 'transparent',
    display: 'grid',
    margin: 0,
    outline: 'none',
    padding: 0,
    placeItems: 'center',
    position: 'relative',
  }]]).compile(), PrecedenceLevel.INTERNAL)
}

/**
 * @public
 */
export type ButtonBaseProps = JSX.IntrinsicElements['button']

/**
 * @public
 */
export interface ButtonBase extends HTMLButtonElement { (props: ButtonBaseProps): JSX.Element }

/**
 * A drop-in replacement for the `<button>` element where
 * the display is set to `'grid'`, position is set to `'relative'`, and
 * the margins and paddings are set to `0`.
 *
 * The component can also be disabled as a group with other components
 * that share the same {@link DisabledContext}.
 *
 * @public
 */
export const ButtonBase = forwardRef(({
  className,
  disabled: $disabled,
  ...props
}: ButtonBaseProps, ref: Ref<HTMLButtonElement>) => {
  const disabled = useInternalDerivedDisabledState($disabled)
  return createElement('button', {
    ...props,
    ref,
    className: c(BASE_CLASSNAME, className),
    ...(isBoolean(disabled) ? { disabled } : {}),
  })
})
