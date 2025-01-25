import {
  addStyles,
  c,
  compileStyles,
  deepRemove,
  deepSet,
  RefObject,
  TruthRecord,
} from '@glyph-cat/swiss-army-knife'
import { ReadOnlyStateManager, SimpleStateManager } from 'cotton-box'
import { useSimpleStateValue } from 'cotton-box-react'
import { Properties } from 'csstype'
import {
  createElement,
  DetailedHTMLProps,
  forwardRef,
  HTMLAttributes,
  InputHTMLAttributes,
  JSX,
  Ref,
  TextareaHTMLAttributes,
  useCallback,
  useId,
  useImperativeHandle,
  useLayoutEffect,
  useRef
} from 'react'

// NOTE: Hashes cannot be generated and used on the fly because
// there would be a mismatch between client and server.

const CORE_UI_CLASSNAME_PREFIX = 'core-ui-'
const CORE_UI_CLASSNAME_VIEW = CORE_UI_CLASSNAME_PREFIX + 'view'
const CORE_UI_CLASSNAME_INPUT = CORE_UI_CLASSNAME_PREFIX + 'input'
const PRECEDENCE_LEVEL_INTERNAL = -1

if (typeof window !== 'undefined') {
  addStyles(compileStyles(new Map<string, Properties>([
    [`.${CORE_UI_CLASSNAME_VIEW}`, {
      display: 'grid',
      position: 'relative',
    }],
    [`.${CORE_UI_CLASSNAME_INPUT}`, {
      fontFamily: 'inherit',
    }],
    // @ts-expect-error `-1` is an internal value for `.INTERNAL`
  ])), PRECEDENCE_LEVEL_INTERNAL)
}

const _InputFocusState = new SimpleStateManager<TruthRecord<string>>({})

/**
 * @public
 */
export const InputFocusState = _InputFocusState as ReadOnlyStateManager<TruthRecord<string>>

/**
 * @returns `true` if there are any <Input> components that are in focus.
 * @public
 */
export function useCheckInputFocus(): boolean {
  return useSimpleStateValue(_InputFocusState, (s) => Object.keys(s).length > 0)
}

/**
 * @internal
 */
function useSharedInputRefHandler<Props extends InputProps | TextAreaProps, T extends HTMLInputElement | HTMLTextAreaElement>(
  props: Props,
  ref: Ref<T>
): RefObject<T> {

  const { autoFocus } = props

  const componentId = useId()
  const inputRef = useRef<T>(null)
  useImperativeHandle(ref, () => inputRef.current)

  const onBlur = useCallback(() => {
    _InputFocusState.set((s) => deepRemove(s, [componentId]))
  }, [componentId])

  useLayoutEffect(() => {
    const onFocus = () => {
      _InputFocusState.set((s) => deepSet(s, [componentId], true))
    }
    const target = inputRef.current
    target.addEventListener('focus', onFocus)
    target.addEventListener('blur', onBlur)
    return () => {
      target.removeEventListener('focus', onFocus)
      target.removeEventListener('blur', onBlur)
    }
  }, [componentId, onBlur])

  const isInitialRender = useRef(true)
  useLayoutEffect(() => {
    // Else passing autofocus directly to the <input> element will not cause
    // focus listener above to be triggered
    if (autoFocus) {
      if (isInitialRender.current) {
        inputRef.current?.focus()
        isInitialRender.current = false
      }
    }
  }, [autoFocus])

  useLayoutEffect(() => {
    // Else onBlur will not be triggered when component unmounts
    return () => { onBlur() }
  }, [onBlur])

  return inputRef

}

/**
 * @public
 */
export type ViewProps = DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>

/**
 * @public
 */
export interface View extends HTMLDivElement { (props: ViewProps): JSX.Element }

/**
 * A drop-in replacement for the `<div>` element with the `display: grid;` style.
 * @public
 */
export const View = forwardRef<HTMLDivElement, ViewProps>(({
  children,
  className,
  ...otherProps
}, ref): JSX.Element => {
  const divRef = useRef<HTMLDivElement>(null)
  useImperativeHandle(ref, () => divRef.current)
  return createElement('div', {
    ref: divRef,
    className: c(CORE_UI_CLASSNAME_VIEW, className),
    ...otherProps,
  }, children)
})

/**
 * @public
 */
export type InputProps = DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>

/**
 * @public
 */
export interface Input extends HTMLInputElement { (props: InputProps): JSX.Element }

/**
 * A drop-in replacement for the `<input>` element.
 * Reasons:
 * - Easy to track and check if any `<input>` elements are in focus.
 * - This can be used to control whether certain keyboard shortcuts should be triggered or not.
 * @public
 */
export const Input = forwardRef(({
  className,
  ...props
}: InputProps, ref: Ref<HTMLInputElement>) => {
  const inputRef = useSharedInputRefHandler(props, ref)
  return createElement('input', {
    ref: inputRef,
    className: c(CORE_UI_CLASSNAME_INPUT, className),
    ...props,
  })
})

/**
 * @public
 */
export type TextAreaProps = DetailedHTMLProps<TextareaHTMLAttributes<HTMLTextAreaElement>, HTMLTextAreaElement>

/**
 * @public
 */
export interface TextArea extends HTMLTextAreaElement { (props: TextAreaProps): JSX.Element }

/**
 * A drop-in replacement for the `<textarea>` element.
 * Reasons:
 * - Easy to track and check if any `<textarea>` elements are in focus.
 * - This can be used to control whether certain keyboard shortcuts should be triggered or not.
 * @public
 */
export const TextArea = forwardRef(({
  className,
  ...props
}: TextAreaProps, ref: Ref<HTMLInputElement>) => {
  const textAreaRef = useSharedInputRefHandler(props, ref)
  return createElement('textarea', {
    ref: textAreaRef,
    className: c(CORE_UI_CLASSNAME_INPUT, className),
    ...props,
  })
})
