import {
  BUILD_HASH,
  c,
  deepRemove,
  deepSet,
  RefObject,
  TruthRecord,
} from '@glyph-cat/swiss-army-knife'
import { SimpleStateManager } from 'cotton-box'
import { useSimpleStateValue } from 'cotton-box-react'
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

enum ComponentMarker {
  VIEW = 1,
  INPUT, // Shared with textarea
}

const DATA_MARKER_KEY = 'data-marker'
const DATA_MARKER_VALUE_PREFIX = 'core-ui'

const SHORT_HASH = BUILD_HASH.substring(0, 6)
const CLASSNAME_VIEW = `core-ui-view-${SHORT_HASH}`
const CLASSNAME_INPUT = `core-ui-input-${SHORT_HASH}`

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
export class CoreUIComposer {

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
   */
  createViewComponent(): ForwardRefExoticComponent<Omit<ViewProps, 'ref'> & RefAttributes<HTMLDivElement>> {
    this.M$loadViewStyles()
    const View = forwardRef<HTMLDivElement, ViewProps>(({
      children,
      className,
      ...otherProps
    }, ref): JSX.Element => {
      const divRef = useRef<HTMLDivElement>(null)
      useImperativeHandle(ref, () => divRef.current)
      return createElement('div', {
        ref: divRef,
        className: c(CLASSNAME_VIEW, className),
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
   */
  createInputComponent(): ForwardRefExoticComponent<Omit<InputProps, 'ref'> & RefAttributes<HTMLInputElement>> {
    this.M$loadInputStyles()
    this.M$initInputFocusState()
    const { useSharedInputRefHandler } = this
    const Input = forwardRef(({
      className,
      ...props
    }: InputProps, ref: Ref<HTMLInputElement>) => {
      const inputRef = useSharedInputRefHandler(props, ref)
      return createElement('input', {
        ref: inputRef,
        className: c(CLASSNAME_INPUT, className),
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
   */
  createTextAreaComponent(): ForwardRefExoticComponent<Omit<TextAreaProps, 'ref'> & RefAttributes<HTMLInputElement>> {
    this.M$loadInputStyles()
    this.M$initInputFocusState()
    const { useSharedInputRefHandler } = this
    const TextArea = forwardRef(({
      className,
      ...props
    }: TextAreaProps, ref: Ref<HTMLInputElement>) => {
      const textAreaRef = useSharedInputRefHandler(props, ref)
      return createElement('textarea', {
        ref: textAreaRef,
        className: c(CLASSNAME_INPUT, className),
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
  private readonly M$initInputFocusState = (): void => {
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

  // #region Unstable

  // These methods are declared as non-static because we might want styles to be
  // customizable in the future.

  private checkIfStylesAreLoaded(
    marker: ComponentMarker
  ): [isLoaded: boolean, dataMarkerValue: string] {
    const dataMarkerValue = `${DATA_MARKER_VALUE_PREFIX}/${marker}`
    const selectorString = `style[${DATA_MARKER_KEY}="${dataMarkerValue}"]`
    return [
      !!document.querySelector(selectorString),
      dataMarkerValue,
    ]
  }

  private M$loadViewStyles(): void {
    if (typeof window !== 'undefined') {
      const [isLoaded, dataMarkerValue] = this.checkIfStylesAreLoaded(ComponentMarker.VIEW)
      if (isLoaded) { return } // Early exit
      const style = document.createElement('style')
      style.setAttribute(DATA_MARKER_KEY, dataMarkerValue)
      style.innerHTML = `.${CLASSNAME_VIEW}{display:grid;position:relative;}`
      const firstStyleLikeElement = findFirstStyleLikeElement()
      document.head.insertBefore(style, firstStyleLikeElement)
    }
  }

  private M$loadInputStyles(): void {
    if (typeof window !== 'undefined') {
      const [isLoaded, dataMarkerValue] = this.checkIfStylesAreLoaded(ComponentMarker.INPUT)
      if (isLoaded) { return } // Early exit
      const style = document.createElement('style')
      style.setAttribute(DATA_MARKER_KEY, dataMarkerValue)
      style.innerHTML = `.${CLASSNAME_INPUT}{font-family:inherit;}`
      document.head.append(style)
      const firstStyleLikeElement = findFirstStyleLikeElement()
      document.head.insertBefore(style, firstStyleLikeElement)
    }
  }

  // #endregion Unstable

}

function findFirstStyleLikeElement(): Element {
  const nodeList = document.head.querySelectorAll([
    'link[rel="stylesheet"]',
    'link[rel="preload"][as="style"]',
    `style:not([${DATA_MARKER_KEY}^="${DATA_MARKER_VALUE_PREFIX}"])`,
  ].join(','))
  // References:
  // - https://stackoverflow.com/a/56328426/5810737
  // - https://stackoverflow.com/a/10777783/5810737
  return nodeList.length > 0 ? nodeList.item(0) : undefined
}
