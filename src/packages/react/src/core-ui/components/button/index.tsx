import { c, isBoolean } from '@glyph-cat/swiss-army-knife'
import { createElement, forwardRef, JSX, Ref } from 'react'
import { useInternalDerivedDisabledState } from '../internals'
import styles from './index.module.css'

/**
 * @public
 */
export type ButtonProps = JSX.IntrinsicElements['button']

/**
 * @public
 */
export interface Button extends HTMLButtonElement { (props: ButtonProps): JSX.Element }

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
export const Button = forwardRef(({
  className,
  disabled: $disabled,
  ...props
}: ButtonProps, ref: Ref<HTMLButtonElement>) => {
  const disabled = useInternalDerivedDisabledState($disabled)
  return createElement('button', {
    ...props,
    ref,
    className: c(styles.button, className),
    ...(isBoolean(disabled) ? { disabled } : {}),
  })
})
