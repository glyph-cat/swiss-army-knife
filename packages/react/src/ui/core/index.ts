import {
  addStyles,
  c,
  compileStyles,
  deepRemove,
  deepSet,
  RefObject,
  TruthRecord,
} from '@glyph-cat/swiss-army-knife'
import { SimpleStateManager } from 'cotton-box'
import { useSimpleStateValue } from 'cotton-box-react'
import { Properties } from 'csstype'
import {
  createElement,
  DetailedHTMLProps,
  forwardRef,
  ForwardRefExoticComponent,
  HTMLAttributes,
  InputHTMLAttributes,
  JSX,
  Ref,
  RefAttributes,
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
const PRECEDENCE_LEVEL_INTERNAL = -1

/**
 * @public
 */
export type ViewProps = DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>

/**
 * @public
 */
export type InputProps = DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>

/**
 * @public
 */
export type TextAreaProps = DetailedHTMLProps<TextareaHTMLAttributes<HTMLTextAreaElement>, HTMLTextAreaElement>

/**
 * @public
 */
export interface IView extends HTMLDivElement { (props: ViewProps): JSX.Element }

/**
 * @public
 */
export interface IInput extends HTMLInputElement { (props: InputProps): JSX.Element }

/**
 * @public
 */
export interface ITextArea extends HTMLTextAreaElement { (props: TextAreaProps): JSX.Element }

/**
 * @example
 * import { CoreUIComposer } from '@glyph-cat/swiss-army-knife-react'
 *
 * const composer = new CoreUIComposer()
 * @public
 */
export class CoreUIComposer {

  /**
   * @internal
   */
  private static M$isViewStylesLoaded = false

  /**
   * @internal
   */
  private static M$isInputStylesLoaded = false

  /**
   * @internal
   */
  private _InputFocusState: SimpleStateManager<TruthRecord<string>> = null

  get InputFocusState(): SimpleStateManager<TruthRecord<string>> {
    return this._InputFocusState
  }

  constructor() {
    this.createViewComponent = this.createViewComponent.bind(this)
    this.createInputComponent = this.createInputComponent.bind(this)
    this.createTextAreaComponent = this.createTextAreaComponent.bind(this)
  }

  /**
   * Creates a drop-in replacement for the `<div>` element with the `display`
   * CSS property set to 'grid'.
   * @example
   * import { IView } from '@glyph-cat/swiss-army-knife-react'
   *
   * export type View = IView
   * export const View = composer.createViewComponent()
   */
  createViewComponent(): ForwardRefExoticComponent<Omit<ViewProps, 'ref'> & RefAttributes<HTMLDivElement>> {
    const baseClassName = this.M$createViewStyles()
    const View = forwardRef<HTMLDivElement, ViewProps>(({
      children,
      className,
      ...otherProps
    }, ref): JSX.Element => {
      const divRef = useRef<HTMLDivElement>(null)
      useImperativeHandle(ref, () => divRef.current)
      return createElement('div', {
        ref: divRef,
        className: c(baseClassName, className),
        ...otherProps,
      }, children)
    })
    return View
  }

  /**
   * Creates a drop-in replacement for the `<input>` element.
   * Reasons:
   * - Easy to track and check if any `<input>` elements are in focus.
   * - This can be used to control whether certain keyboard shortcuts should be triggered or not.
   * @example
   * import { IInput } from '@glyph-cat/swiss-army-knife-react'
   *
   * export type Input = IInput
   * export const Input = composer.createInputComponent()
   */
  createInputComponent(): ForwardRefExoticComponent<Omit<InputProps, 'ref'> & RefAttributes<HTMLInputElement>> {
    const baseClassName = this.M$loadInputStyles()
    this.M$initInputFocusState()
    const { useSharedInputRefHandler } = this
    const Input = forwardRef(({
      className,
      ...props
    }: InputProps, ref: Ref<HTMLInputElement>) => {
      const inputRef = useSharedInputRefHandler(props, ref)
      return createElement('input', {
        ref: inputRef,
        className: c(baseClassName, className),
        ...props,
      })
    })
    return Input
  }

  /**
   * Creates a drop-in replacement for the `<textarea>` element.
   * Reasons:
   * - Easy to track and check if any `<textarea>` elements are in focus.
   * - This can be used to control whether certain keyboard shortcuts should be triggered or not.
   * @example
   * import { ITextArea } from '@glyph-cat/swiss-army-knife-react'
   *
   * export type TextArea = ITextArea
   * export const TextArea = composer.createTextAreaComponent()
   */
  createTextAreaComponent(): ForwardRefExoticComponent<Omit<TextAreaProps, 'ref'> & RefAttributes<HTMLInputElement>> {
    const baseClassName = this.M$loadInputStyles()
    this.M$initInputFocusState()
    const { useSharedInputRefHandler } = this
    const TextArea = forwardRef(({
      className,
      ...props
    }: TextAreaProps, ref: Ref<HTMLInputElement>) => {
      const textAreaRef = useSharedInputRefHandler(props, ref)
      return createElement('textarea', {
        ref: textAreaRef,
        className: c(baseClassName, className),
        ...props,
      })
    })
    return TextArea
  }

  /**
   * @returns `true` if there are any <Input> components that are in focus.
   */
  readonly useCheckInputFocus = (): boolean => {
    return useSimpleStateValue(this.InputFocusState, (s) => Object.keys(s).length > 0)
  }

  /**
   * @internal
   */
  private M$initInputFocusState(): void {
    if (this._InputFocusState) { return } // Early exit
    this._InputFocusState = new SimpleStateManager<TruthRecord<string>>({})
  }

  /**
   * @internal
   */
  private readonly useSharedInputRefHandler = <Props extends InputProps | TextAreaProps, T extends HTMLInputElement | HTMLTextAreaElement>(
    props: Props,
    ref: Ref<T>
  ): RefObject<T> => {

    const { autoFocus } = props

    const componentId = useId()
    const inputRef = useRef<T>(null)
    useImperativeHandle(ref, () => inputRef.current)

    const onBlur = useCallback(() => {
      this.InputFocusState.set((s) => deepRemove(s, [componentId]))
    }, [componentId])

    useLayoutEffect(() => {
      const onFocus = () => {
        this.InputFocusState.set((s) => deepSet(s, [componentId], true))
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
   * @internal
   */
  private M$createViewStyles(): string {
    const className = CORE_UI_CLASSNAME_PREFIX + 'view'
    if (typeof window !== 'undefined') {
      if (!CoreUIComposer.M$isViewStylesLoaded) {
        addStyles(compileStyles(new Map<string, Properties>([
          [className, {
            display: 'grid',
            position: 'relative',
          }],
          // @ts-expect-error `-1` is an internal value for `.INTERNAL`
        ])), PRECEDENCE_LEVEL_INTERNAL)
        CoreUIComposer.M$isViewStylesLoaded = true
      }
    }
    return className
  }

  /**
   * @internal
   */
  private M$loadInputStyles(): string {
    const className = CORE_UI_CLASSNAME_PREFIX + 'input'
    if (typeof window === 'undefined') {
      if (!CoreUIComposer.M$isInputStylesLoaded) {
        addStyles(compileStyles(new Map<string, Properties>([
          [className, {
            fontFamily: 'inherit',
          }],
          // @ts-expect-error `-1` is an internal value for `.INTERNAL`
        ])), PRECEDENCE_LEVEL_INTERNAL)
        CoreUIComposer.M$isInputStylesLoaded = true
      }
    }
    return className
  }

}
