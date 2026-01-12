import { c } from '@glyph-cat/swiss-army-knife'
import { isBoolean } from '@glyph-cat/type-checking'
import { createElement, forwardRef, JSX, Ref } from 'react'
import { BUTTON_STYLES, useInternalDerivedDisabledState } from '../_internals'

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
    className: c(BUTTON_STYLES, className),
    ...(isBoolean(disabled) ? { disabled } : {}),
  })
})
