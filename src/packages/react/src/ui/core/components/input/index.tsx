import { addStyles, c, isBoolean, PrecedenceLevel, StyleMap } from '@glyph-cat/swiss-army-knife'
import { createElement, forwardRef, JSX, Ref } from 'react'
import { useCommonFocusableRefHandler } from '../../input-focus'
import { createCoreUIComponentClassName, useInternalDerivedDisabledState } from '../internals'

const BASE_CLASSNAME = createCoreUIComponentClassName('input')

if (typeof window !== 'undefined') {
  addStyles(new StyleMap([[BASE_CLASSNAME, {
    backgroundColor: 'transparent',
    border: 'none',
    display: 'grid',
    fontFamily: 'inherit',
    margin: 0,
    outline: 'none',
    padding: 0,
  }]]).compile(), PrecedenceLevel.INTERNAL)
}

/**
 * @public
 */
export type InputProps = JSX.IntrinsicElements['input']

/**
 * @public
 */
export interface Input extends HTMLInputElement { (props: InputProps): JSX.Element }

/**
 * A drop-in replacement for the `<input>` element.
 * Reasons:
 * - Easy to track and check if any similar elements sharing
 *   the same {@link InputFocusTracker} are in focus.
 * - This can be used to prevent keyboard shortcuts from being triggered when
 *   the input is in focus.
 * - Component can be disabled as a group with other components that share
 *   the same {@link DisabledContext}.
 * @public
 */
export const Input = forwardRef(({
  className,
  disabled: $disabled,
  ...props
}: InputProps, ref: Ref<HTMLInputElement>): JSX.Element => {
  const inputRef = useCommonFocusableRefHandler(props, ref)
  const disabled = useInternalDerivedDisabledState($disabled)
  // eslint-disable-next-line react/forbid-elements
  return createElement('input', {
    ...props,
    ref: inputRef,
    className: c(BASE_CLASSNAME, className),
    ...(isBoolean(disabled) ? { disabled } : {}),
  })
})

/**
 * @public
 */
export type TextAreaProps = JSX.IntrinsicElements['textarea']

/**
 * @public
 */
export interface TextArea extends HTMLTextAreaElement { (props: TextAreaProps): JSX.Element }

/**
 * A drop-in replacement for the `<textarea>` element.
 * Reasons:
 * - Easy to track and check if any similar elements sharing
 *   the same {@link InputFocusTracker} are in focus.
 * - This can be used to prevent keyboard shortcuts from being triggered when
 *   the textarea is in focus.
 * - Component can be disabled as a group with other components that share
 *   the same {@link DisabledContext}.
 * @public
 */
export const TextArea = forwardRef(({
  className,
  disabled: $disabled,
  ...props
}: TextAreaProps, ref: Ref<HTMLTextAreaElement>) => {
  const textAreaRef = useCommonFocusableRefHandler(props, ref)
  const disabled = useInternalDerivedDisabledState($disabled)
  // eslint-disable-next-line react/forbid-elements
  return createElement('textarea', {
    ...props,
    ref: textAreaRef,
    className: c(BASE_CLASSNAME, className),
    ...(isBoolean(disabled) ? { disabled } : {}),
  })
})
