import {
  addStyles,
  c,
  CleanupFunction,
  Color,
  ColorFormat,
  compileStyles,
  createRef,
  deepRemove,
  deepSet,
  devWarn,
  Empty,
  ExtendedCSSProperties,
  IDisposable,
  IS_DEBUG_ENV,
  isBoolean,
  RefObject,
  StringRecord,
} from '@glyph-cat/swiss-army-knife'
import {
  createElement,
  forwardRef,
  JSX,
  Ref,
  useImperativeHandle,
  useLayoutEffect,
  useRef,
} from 'react'
import { DisabledContext } from '../disabled-context'
import { InputFocusTracker } from '../input-focus'
import { LayeredFocusManager } from '../layered-focus'
import {
  ButtonProps,
  CreateComponentPayload,
  FocusableViewProps,
  IButtonComponent,
  IFocusableViewComponent,
  IInputComponent,
  InputProps,
  ISelectComponent,
  ITextAreaComponent,
  IViewComponent,
  SelectProps,
  TextAreaProps,
  ViewProps,
} from './abstractions'

// NOTE: Hashes cannot be generated and used as keys on the fly because
// there would be a mismatch between client and server.

enum CoreComponentType {
  VIEW = 1,
  FOCUSABLE_VIEW,
  INPUT,
  TEXTAREA,
  BUTTON,
  SELECT,
}

/**
 * @public
 */
export interface CreateFocusableViewOptions {
  /**
   * @defaultValue `true`
   */
  allowRefocus?: boolean
}

/**
 * @public
 */
export interface CoreUIComposerConfigs {
  disabledContext: DisabledContext
  inputFocusTracker: InputFocusTracker
  layeredFocusManager: LayeredFocusManager
  /**
   * Any RGB, HSL, or hex string. Opacity values will be ignored.
   */
  tint?: string
  /**
   * Any number between `0` to `1`.
   * @defaultValue `0.35`
   */
  textSelectionOpacity?: number
}

/**
 * @public
 */
export class CoreUIComposer implements IDisposable {

  /**
   * @internal
   */
  private M$allStyleElementsCache: StringRecord<[
    styleElement: HTMLStyleElement,
    removeStyles: CleanupFunction,
  ]> = {}

  /**
   * @internal
   */
  private readonly M$sharedClassName: string

  /**
   * @internal
   */
  private readonly M$tint: Color

  /**
   * @internal
   */
  private readonly M$textSelectionColor: Color

  constructor(
    public readonly key: string,
    /**
     * @internal
     */
    private readonly configs: Readonly<CoreUIComposerConfigs>,
  ) {
    warnIfKeyIsInvalid(this.key)
    withCoreUIPrefix(this.key)
    this.M$sharedClassName = withCoreUIPrefix(this.key)
    const { tint, textSelectionOpacity } = configs
    if (tint) {
      this.M$tint = Color.fromString(tint)
      this.M$textSelectionColor = Color.fromRGBObject({
        ...this.M$tint.toJSON(),
        alpha: textSelectionOpacity ?? 0.35,
      })
      this.M$compileAndAddStylesInClientOnly(
        this.M$sharedClassName,
        new Map([
          [`.${this.M$sharedClassName}::selection`, {
            backgroundColor: this.M$textSelectionColor.toString(ColorFormat.FFFFFFFF),
          }],
        ])
      )
    }
  }

  /**
   * Creates a drop-in replacement for the `<div>` element where
   * the display is set to `'grid'` and position is set to `'relative'`.
   * @param key - This value should be a unique and stable across server-client renders.
   * @param overrideStyles - Additional styles to apply.
   */
  createViewComponent(
    key: string,
    overrideStyles?: ExtendedCSSProperties,
  ): CreateComponentPayload<IViewComponent> {
    warnIfKeyIsInvalid(key)
    const baseClassName = this.M$getPrefixedClassName(CoreComponentType.VIEW, key)
    const removeStyles = this.M$compileAndAddStylesInClientOnly(
      baseClassName,
      new Map([
        [`.${baseClassName}`, {
          display: 'grid',
          position: 'relative',
          ...overrideStyles,
        }],
      ])
    )
    const View = forwardRef<HTMLDivElement, ViewProps>(({
      children,
      className,
      ...otherProps
    }, ref): JSX.Element => {
      const divRef = useRef<HTMLDivElement>(null)
      useImperativeHandle(ref, () => divRef.current)
      return createElement('div', {
        ref: divRef,
        className: c(this.M$sharedClassName, baseClassName, className),
        ...otherProps,
      }, children)
    })
    return [View, removeStyles]
  }

  /**
   * Creates a drop-in replacement for the `<div>` element.
   * This is similar to {@link IView} except it can track focus using the {@link LayeredFocusManager}.
   *
   * Notes:
   * - Input components track focus using {@link InputFocusTracker} instead.
   * - {@link LayeredFocusManager} and {@link InputFocusTracker} do not interfere with each other.
   *
   * @param key - This value should be a unique and stable across server-client renders.
   * @param overrideStyles - Additional styles to apply.
   */
  createFocusableViewComponent(
    key: string,
    options: CreateFocusableViewOptions = { allowRefocus: true },
    overrideStyles?: ExtendedCSSProperties,
  ): CreateComponentPayload<IFocusableViewComponent> {

    warnIfKeyIsInvalid(key)
    const baseClassName = this.M$getPrefixedClassName(CoreComponentType.FOCUSABLE_VIEW, key)
    const removeStyles = this.M$compileAndAddStylesInClientOnly(
      baseClassName,
      new Map([
        [`.${baseClassName}`, {
          display: 'grid',
          position: 'relative',
          ...overrideStyles,
        }],
      ])
    )

    const { configs: { layeredFocusManager } } = this
    const { FocusLayer, useLayeredFocusState } = layeredFocusManager

    interface ClickFocusListenerProps {
      divRef: RefObject<HTMLDivElement>
    }

    const RefocusObserver = ({ divRef }: ClickFocusListenerProps) => {
      const [, layerId] = useLayeredFocusState()
      useLayoutEffect(() => {
        const onMouseDown = () => {
          layeredFocusManager.M$state.set((s) => deepSet(
            deepRemove(s, [layerId]),
            [layerId],
            true
          ))
        }
        const target = divRef.current
        target.addEventListener('mousedown', onMouseDown)
        return () => { target.removeEventListener('mousedown', onMouseDown) }
      }, [divRef, layerId])
      return null
    }

    const FocusableView = forwardRef<HTMLDivElement, FocusableViewProps>(({
      children,
      className,
      ...otherProps
    }, ref): JSX.Element => {
      const divRef = useRef<HTMLDivElement>(null)
      useImperativeHandle(ref, () => divRef.current)
      return (
        <FocusLayer>
          <div
            ref={divRef}
            className={c(this.M$sharedClassName, baseClassName, className)}
            {...otherProps}
          >
            {children}
          </div>
          {options?.allowRefocus && (<RefocusObserver divRef={divRef} />)}
        </FocusLayer>
      )
    })

    return [FocusableView, removeStyles]

  }

  /**
   * Creates a drop-in replacement for the `<input>` element.
   * Reasons:
   * - Easy to track and check if any similar elements sharing
   *   the same {@link InputFocusTracker} are in focus.
   * - This can be used to prevent keyboard shortcuts from being triggered when
   *   the input is in focus.
   * - Component can be disabled as a group with other components that share
   *   the same {@link DisabledContext}.
   * @param key - This value should be a unique and stable across server-client renders.
   * @param overrideStyles - Additional styles to apply.
   */
  createInputComponent(
    key: string,
    overrideStyles?: ExtendedCSSProperties,
  ): CreateComponentPayload<IInputComponent> {
    warnIfKeyIsInvalid(key)
    const baseClassName = this.M$getPrefixedClassName(CoreComponentType.INPUT, key)
    const removeStyles = this.M$compileAndAddStylesInClientOnly(
      baseClassName,
      new Map([
        [`.${baseClassName}`, {
          fontFamily: 'inherit',
          margin: 0,
          padding: 0,
          ...overrideStyles,
        }],
      ])
    )
    const {
      disabledContext: { useDerivedDisabledState },
      inputFocusTracker: { useSharedFocusableRefHandler },
    } = this.configs
    const Input = forwardRef(({
      className,
      disabled: $disabled,
      ...props
    }: InputProps, ref: Ref<HTMLInputElement>) => {
      const inputRef = useSharedFocusableRefHandler(props, ref)
      const disabled = useDerivedDisabledState($disabled)
      return createElement('input', {
        ref: inputRef,
        className: c(this.M$sharedClassName, baseClassName, className),
        ...(isBoolean(disabled) ? { disabled } : {}),
        ...props,
      })
    })
    return [Input, removeStyles]
  }

  /**
   * Creates a drop-in replacement for the `<textarea>` element.
   * Reasons:
   * - Easy to track and check if any similar elements sharing
   *   the same {@link InputFocusTracker} are in focus.
   * - This can be used to prevent keyboard shortcuts from being triggered when
   *   the textarea is in focus.
   * - Component can be disabled as a group with other components that share
   *   the same {@link DisabledContext}.
   * @param key - This value should be a unique and stable across server-client renders.
   * @param overrideStyles - Additional styles to apply.
   */
  createTextAreaComponent(
    key: string,
    overrideStyles?: ExtendedCSSProperties,
  ): CreateComponentPayload<ITextAreaComponent> {
    warnIfKeyIsInvalid(key)
    const baseClassName = this.M$getPrefixedClassName(CoreComponentType.TEXTAREA, key)
    const removeStyles = this.M$compileAndAddStylesInClientOnly(
      baseClassName,
      new Map([
        [`.${baseClassName}`, {
          fontFamily: 'inherit',
          margin: 0,
          padding: 0,
          ...overrideStyles,
        }],
      ])
    )
    const {
      disabledContext: { useDerivedDisabledState },
      inputFocusTracker: { useSharedFocusableRefHandler },
    } = this.configs
    const TextArea = forwardRef(({
      className,
      disabled: $disabled,
      ...props
    }: TextAreaProps, ref: Ref<HTMLTextAreaElement>) => {
      const textAreaRef = useSharedFocusableRefHandler(props, ref)
      const disabled = useDerivedDisabledState($disabled)
      return createElement('textarea', {
        ref: textAreaRef,
        className: c(this.M$sharedClassName, baseClassName, className),
        ...(isBoolean(disabled) ? { disabled } : {}),
        ...props,
      })
    })
    return [TextArea, removeStyles]
  }

  /**
   * Creates a drop-in replacement for the `<button>` element where
   * the display is set to `'grid'`, position is set to `'relative'`, and
   * the margins and paddings are set to `0`.
   *
   * The component can also be disabled as a group with other components
   * that share the same {@link DisabledContext}.
   *
   * @param key - This value should be a unique and stable across server-client renders.
   * @param overrideStyles - Additional styles to apply.
   */
  createButtonComponent(
    key: string,
    overrideStyles?: ExtendedCSSProperties,
  ): CreateComponentPayload<IButtonComponent> {
    warnIfKeyIsInvalid(key)
    const baseClassName = this.M$getPrefixedClassName(CoreComponentType.BUTTON, key)
    const removeStyles = this.M$compileAndAddStylesInClientOnly(
      baseClassName,
      new Map([
        [`.${baseClassName}`, {
          display: 'grid',
          margin: 0,
          padding: 0,
          position: 'relative',
          ...overrideStyles,
        }],
      ])
    )
    const { configs: { disabledContext: { useDerivedDisabledState } } } = this
    const Button = forwardRef(({
      className,
      disabled: $disabled,
      ...props
    }: ButtonProps, ref: Ref<HTMLButtonElement>) => {
      const disabled = useDerivedDisabledState($disabled)
      return createElement('button', {
        ref,
        className: c(this.M$sharedClassName, baseClassName, className),
        ...(isBoolean(disabled) ? { disabled } : {}),
        ...props,
      })
    })
    return [Button, removeStyles]
  }

  /**
   * Creates a drop-in replacement for the `<select>` element.
   * Reasons:
   * - Easy to track and check if any similar elements sharing
   *   the same {@link InputFocusTracker} are in focus.
   * - This can be used to prevent keyboard shortcuts from being triggered when
   *   the textarea is in focus.
   * - Component can be disabled as a group with other components that share
   *   the same {@link DisabledContext}.
   * @param key - This value should be a unique and stable across server-client renders.
   * @param overrideStyles - Additional styles to apply.
   */
  createSelectComponent(
    key: string,
    overrideStyles?: ExtendedCSSProperties,
  ): CreateComponentPayload<ISelectComponent> {
    warnIfKeyIsInvalid(key)
    const baseClassName = this.M$getPrefixedClassName(CoreComponentType.SELECT, key)
    const removeStyles = this.M$compileAndAddStylesInClientOnly(
      baseClassName,
      new Map([
        [`.${baseClassName}`, {
          fontFamily: 'inherit',
          ...overrideStyles,
        }],
      ])
    )
    const {
      disabledContext: { useDerivedDisabledState },
      inputFocusTracker: { useSharedFocusableRefHandler },
    } = this.configs
    const Select = forwardRef(({
      children,
      className,
      disabled: $disabled,
      ...props
    }: SelectProps, ref: Ref<HTMLSelectElement>) => {
      const selectRef = useSharedFocusableRefHandler(props, ref)
      const disabled = useDerivedDisabledState($disabled)
      return createElement('select', {
        ref: selectRef,
        className: c(this.M$sharedClassName, baseClassName, className),
        ...(isBoolean(disabled) ? { disabled } : {}),
        ...props,
      }, children)
    })
    return [Select, removeStyles]
  }

  dispose(): void {
    for (const key in this.M$allStyleElementsCache) {
      const [, removeStyles] = this.M$allStyleElementsCache[key]
      removeStyles()
    }
  }

  // #region Internal methods

  /**
   * @internal
   */
  private M$getPrefixedClassName(type: CoreComponentType, subKey: string): string {
    return withCoreUIPrefix(`${this.key}-${type}-${subKey}`)
  }

  /**
   * @internal
   */
  private M$compileAndAddStylesInClientOnly(
    key: string,
    ...args: Parameters<typeof compileStyles>
  ): CleanupFunction {
    if (typeof window === 'undefined') {
      return Empty.FUNCTION // Early exit
    }
    const compiledStyles = compileStyles(...args)
    if (this.M$allStyleElementsCache[key]) {
      const [styleElement, removeStyles] = this.M$allStyleElementsCache[key]
      styleElement.innerHTML = compiledStyles
      return removeStyles // Early exit
    }
    const styleElementRef = createRef<HTMLStyleElement>(null)
    const removeStyles = addStyles(
      compiledStyles,
      // @ts-expect-error `-1` is an internal value for `.INTERNAL`
      -1,
      styleElementRef,
    )
    this.M$allStyleElementsCache[key] = [styleElementRef.current, removeStyles]
    return removeStyles
  }

  // #endregion Internal methods

}

// #region Static helpers

function withCoreUIPrefix(value: string): string {
  return 'core-ui-' + value
}

function warnIfKeyIsInvalid(key: string): void {
  if (IS_DEBUG_ENV) {
    if (!/^[a-z0-9_-]$/.test(key)) {
      devWarn(`Keys should only contain alphanumeric characters, dashes, and/or underscores but received "${key}"`)
    }
  }
}

// #endregion Static helpers

// #region Miscellaneous exports
export * from './abstractions/public'
// #endregion Miscellaneous exports
