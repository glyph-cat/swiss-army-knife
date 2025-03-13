import { c, isBoolean } from '@glyph-cat/swiss-army-knife'
import { createElement, forwardRef, JSX, Ref } from 'react'
import { useInternalDerivedDisabledState } from '../internals'
import styles from './index.module.css'

/**
 * @public
 */
export type FieldSetProps = JSX.IntrinsicElements['fieldset']

/**
 * @public
 */
export interface FieldSet extends HTMLSelectElement { (props: FieldSetProps): JSX.Element }

/**
 * A drop-in replacement for the `<fieldset>` element.
 * This component can be disabled as a group with other components that share
 * the same {@link DisabledContext}.
 * @public
 */
export const FieldSet = forwardRef(({
  children,
  className,
  disabled: $disabled,
  ...props
}: FieldSetProps, ref: Ref<HTMLFieldSetElement>) => {
  const disabled = useInternalDerivedDisabledState($disabled)
  return createElement('fieldset', {
    ...props,
    ref,
    className: c(styles.fieldset, className),
    ...(isBoolean(disabled) ? { disabled } : {}),
  }, children)
})
