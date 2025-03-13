// import {
//   c,
//   IDisposable,
//   isBoolean,
//   StyleManager,
// } from '@glyph-cat/swiss-army-knife'
// import { createElement, forwardRef, Ref } from 'react'
// import { useCommonFocusableRefHandler } from '../input-focus'

// // NOTE: Hashes cannot be generated and used as keys on the fly because
// // there would be a mismatch between client and server.

// enum CoreComponentType {
//   VIEW = 1,
//   FOCUSABLE_VIEW,
//   INPUT,
//   TEXTAREA,
//   BUTTON,
//   SELECT,
//   FIELDSET,
// }

// /**
//  * @public
//  */
// export class CoreUIComposer implements IDisposable {

//   /**
//    * @internal
//    */
//   private M$styleManager?: StyleManager

//   /**
//    * @internal
//    */
//   private readonly M$sharedClassName: string

//   // constructor(public readonly key: string) {
//   //   warnIfKeyIsInvalid(this.key)
//   //   this.M$sharedClassName = withCoreUIPrefix(this.key)
//   //   if (typeof window !== 'undefined') {
//   //     this.M$styleManager = new StyleManager([], -1 as PrecedenceLevel)
//   //     // NOTE `-1` is an internal value for `PrecedenceLevel.INTERNAL`
//   //   }
//   // }

//   // /**
//   //  * Creates a drop-in replacement for the `<div>` element where
//   //  * the display is set to `'grid'` and position is set to `'relative'`.
//   //  * @param key - This value should be a unique and stable across server-client renders.
//   //  */
//   // createViewComponent(key: string): IViewComponent {
//   //   warnIfKeyIsInvalid(key)
//   //   const baseClassName = this.M$getPrefixedClassName(CoreComponentType.VIEW, key)
//   //   this.M$styleManager?.set(`.${baseClassName}`, {
//   //     display: 'grid',
//   //     position: 'relative',
//   //   })
//   //   const View = forwardRef<HTMLDivElement, ViewProps>(({
//   //     children,
//   //     className,
//   //     ...otherProps
//   //   }, ref): JSX.Element => {
//   //     const divRef = useRef<HTMLDivElement>(null)
//   //     useImperativeHandle(ref, () => divRef.current)
//   //     return createElement('div', {
//   //       ref: divRef,
//   //       className: c(this.M$sharedClassName, baseClassName, className),
//   //       ...otherProps,
//   //     }, children)
//   //   })
//   //   return View
//   // }

//   // /**
//   //  * Creates a drop-in replacement for the `<div>` element.
//   //  * This is similar to {@link IView} except it can track focus using the {@link LayeredFocusManager}.
//   //  *
//   //  * Notes:
//   //  * - Input components track focus using {@link InputFocusTracker} instead.
//   //  * - {@link LayeredFocusManager} and {@link InputFocusTracker} do not interfere with each other.
//   //  *
//   //  * @param key - This value should be a unique and stable across server-client renders.
//   //  */
//   // createFocusableViewComponent(key: string): IFocusableViewComponent {

//   //   warnIfKeyIsInvalid(key)
//   //   const baseClassName = this.M$getPrefixedClassName(CoreComponentType.FOCUSABLE_VIEW, key)
//   //   this.M$styleManager?.set(`.${baseClassName}`, {
//   //     display: 'grid',
//   //     position: 'relative',
//   //   })

//   //   // const {
//   //   //   configs: {
//   //   //     layeredFocusManager: {
//   //   //       FocusLayer,
//   //   //       FocusObserver,
//   //   //     },
//   //   //   },
//   //   // } = this

//   //   const FocusableView = forwardRef<HTMLDivElement, FocusableViewProps>(({
//   //     children,
//   //     className,
//   //     allowRefocus = true,
//   //     ignoreSiblings,
//   //     effective = true,
//   //     ...otherProps
//   //   }, ref): JSX.Element => {
//   //     // TODO: Should intercept props `onFocus` and `onBlur`; `addEventListener` for focus and blur; imperative ref `.focus` and `.blur` ... first of all, find of if it is possible for divs to be focused (semantically speaking / based on the web standard)
//   //     const divRef = useRef<HTMLDivElement>(null)
//   //     useImperativeHandle(ref, () => divRef.current)
//   //     return (
//   //       <FocusLayer ignoreSiblings={ignoreSiblings} effective={effective}>
//   //         <div
//   //           ref={divRef}
//   //           className={c(this.M$sharedClassName, baseClassName, className)}
//   //           {...otherProps}
//   //         >
//   //           {children}
//   //         </div>
//   //         <FocusObserver
//   //           elementRef={divRef}
//   //           allowRefocus={allowRefocus}
//   //         />
//   //       </FocusLayer>
//   //     )
//   //   })

//   //   return FocusableView

//   // }

//   // /**
//   //  * Creates a drop-in replacement for the `<input>` element.
//   //  * Reasons:
//   //  * - Easy to track and check if any similar elements sharing
//   //  *   the same {@link InputFocusTracker} are in focus.
//   //  * - This can be used to prevent keyboard shortcuts from being triggered when
//   //  *   the input is in focus.
//   //  * - Component can be disabled as a group with other components that share
//   //  *   the same {@link DisabledContext}.
//   //  * @param key - This value should be a unique and stable across server-client renders.
//   //  */
//   // createInputComponent(key: string): IInputComponent {
//   //   warnIfKeyIsInvalid(key)
//   //   const baseClassName = this.M$getPrefixedClassName(CoreComponentType.INPUT, key)
//   //   this.M$styleManager?.set(`.${baseClassName}`, {
//   //     backgroundColor: 'transparent',
//   //     border: 'none',
//   //     display: 'grid',
//   //     fontFamily: 'inherit',
//   //     margin: 0,
//   //     outline: 'none',
//   //     padding: 0,
//   //   })
//   //   const { useInternalDerivedDisabledState } = this
//   //   const Input = forwardRef(({
//   //     className,
//   //     disabled: $disabled,
//   //     ...props
//   //   }: InputProps, ref: Ref<HTMLInputElement>) => {
//   //     const inputRef = useCommonFocusableRefHandler(props, ref)
//   //     const disabled = useInternalDerivedDisabledState($disabled)
//   //     return createElement('input', {
//   //       ...props,
//   //       ref: inputRef,
//   //       className: c(this.M$sharedClassName, baseClassName, className),
//   //       ...(isBoolean(disabled) ? { disabled } : {}),
//   //     })
//   //   })
//   //   return Input
//   // }

//   // /**
//   //  * Creates a drop-in replacement for the `<textarea>` element.
//   //  * Reasons:
//   //  * - Easy to track and check if any similar elements sharing
//   //  *   the same {@link InputFocusTracker} are in focus.
//   //  * - This can be used to prevent keyboard shortcuts from being triggered when
//   //  *   the textarea is in focus.
//   //  * - Component can be disabled as a group with other components that share
//   //  *   the same {@link DisabledContext}.
//   //  * @param key - This value should be a unique and stable across server-client renders.
//   //  */
//   // createTextAreaComponent(key: string): ITextAreaComponent {
//   //   warnIfKeyIsInvalid(key)
//   //   const baseClassName = this.M$getPrefixedClassName(CoreComponentType.TEXTAREA, key)
//   //   this.M$styleManager?.set(`.${baseClassName}`, {
//   //     backgroundColor: 'transparent',
//   //     border: 'none',
//   //     display: 'grid',
//   //     fontFamily: 'inherit',
//   //     margin: 0,
//   //     outline: 'none',
//   //     padding: 0,
//   //   })
//   //   const { useInternalDerivedDisabledState } = this
//   //   const TextArea = forwardRef(({
//   //     className,
//   //     disabled: $disabled,
//   //     ...props
//   //   }: TextAreaProps, ref: Ref<HTMLTextAreaElement>) => {
//   //     const textAreaRef = useCommonFocusableRefHandler(props, ref)
//   //     const disabled = useInternalDerivedDisabledState($disabled)
//   //     return createElement('textarea', {
//   //       ...props,
//   //       ref: textAreaRef,
//   //       className: c(this.M$sharedClassName, baseClassName, className),
//   //       ...(isBoolean(disabled) ? { disabled } : {}),
//   //     })
//   //   })
//   //   return TextArea
//   // }

//   // /**
//   //  * Creates a drop-in replacement for the `<button>` element where
//   //  * the display is set to `'grid'`, position is set to `'relative'`, and
//   //  * the margins and paddings are set to `0`.
//   //  *
//   //  * The component can also be disabled as a group with other components
//   //  * that share the same {@link DisabledContext}.
//   //  *
//   //  * @param key - This value should be a unique and stable across server-client renders.
//   //  */
//   // createButtonComponent(key: string): IButtonComponent {
//   //   warnIfKeyIsInvalid(key)
//   //   const baseClassName = this.M$getPrefixedClassName(CoreComponentType.BUTTON, key)
//   //   this.M$styleManager?.set(`.${baseClassName}`, {
//   //     appearance: 'none',
//   //     border: 'none',
//   //     backgroundColor: 'transparent',
//   //     display: 'grid',
//   //     margin: 0,
//   //     outline: 'none',
//   //     padding: 0,
//   //     placeItems: 'center',
//   //     position: 'relative',
//   //   })
//   //   const { useInternalDerivedDisabledState } = this
//   //   const Button = forwardRef(({
//   //     className,
//   //     disabled: $disabled,
//   //     ...props
//   //   }: ButtonProps, ref: Ref<HTMLButtonElement>) => {
//   //     const disabled = useInternalDerivedDisabledState($disabled)
//   //     return createElement('button', {
//   //       ...props,
//   //       ref,
//   //       className: c(this.M$sharedClassName, baseClassName, className),
//   //       ...(isBoolean(disabled) ? { disabled } : {}),
//   //     })
//   //   })
//   //   return Button
//   // }

//   // /**
//   //  * Creates a drop-in replacement for the `<select>` element.
//   //  * Reasons:
//   //  * - Easy to track and check if any similar elements sharing
//   //  *   the same {@link InputFocusTracker} are in focus.
//   //  * - This can be used to prevent keyboard shortcuts from being triggered when
//   //  *   the textarea is in focus.
//   //  * - Component can be disabled as a group with other components that share
//   //  *   the same {@link DisabledContext}.
//   //  * @param key - This value should be a unique and stable across server-client renders.
//   //  */
//   // createSelectComponent(key: string): ISelectComponent {
//   //   warnIfKeyIsInvalid(key)
//   //   const baseClassName = this.M$getPrefixedClassName(CoreComponentType.SELECT, key)
//   //   this.M$styleManager?.set(`.${baseClassName}`, {
//   //     fontFamily: 'inherit',
//   //   })
//   //   const { useInternalDerivedDisabledState } = this
//   //   const Select = forwardRef(({
//   //     children,
//   //     className,
//   //     disabled: $disabled,
//   //     ...props
//   //   }: SelectProps, ref: Ref<HTMLSelectElement>) => {
//   //     const selectRef = useCommonFocusableRefHandler(props, ref)
//   //     const disabled = useInternalDerivedDisabledState($disabled)
//   //     return createElement('select', {
//   //       ...props,
//   //       ref: selectRef,
//   //       className: c(this.M$sharedClassName, baseClassName, className),
//   //       ...(isBoolean(disabled) ? { disabled } : {}),
//   //     }, children)
//   //   })
//   //   return Select
//   // }

//   // /**
//   //  * Creates a drop-in replacement for the `<fieldset>` element.
//   //  * This component can be disabled as a group with other components that share
//   //  * the same {@link DisabledContext}.
//   //  * @param key - This value should be a unique and stable across server-client renders.
//   //  */
//   // createFieldSetComponent(key: string): IFieldSetComponent {
//   //   warnIfKeyIsInvalid(key)
//   //   const baseClassName = this.M$getPrefixedClassName(CoreComponentType.FIELDSET, key)
//   //   this.M$styleManager?.set(`.${baseClassName}`, {
//   //     fontFamily: 'inherit',
//   //   })
//   //   const { useInternalDerivedDisabledState } = this
//   //   const FieldSet = forwardRef(({
//   //     children,
//   //     className,
//   //     disabled: $disabled,
//   //     ...props
//   //   }: FieldSetProps, ref: Ref<HTMLFieldSetElement>) => {
//   //     const disabled = useInternalDerivedDisabledState($disabled)
//   //     return createElement('fieldset', {
//   //       ...props,
//   //       ref,
//   //       className: c(this.M$sharedClassName, baseClassName, className),
//   //       ...(isBoolean(disabled) ? { disabled } : {}),
//   //     }, children)
//   //   })
//   //   return FieldSet
//   // }

//   dispose(): void {
//     this.M$styleManager?.dispose()
//   }

//   // #region Internal methods

//   // /**
//   //  * @internal
//   //  */
//   // private M$getPrefixedClassName(type: CoreComponentType, subKey: string): string {
//   //   return withCoreUIPrefix(`${this.key}-${type}-${subKey}`)
//   // }

//   // /**
//   //  * @internal
//   //  */
//   // useInternalDerivedDisabledState = (disabled: boolean): Nullable<boolean> => {
//   //   const [isFocused] = useLayeredFocusState()
//   //   // Focusability takes precedence, if not focused, then element should be disabled,
//   //   // even if the props specifies `disabled=false`.
//   //   // Semantically speaking, we can only enforce `disabled=false` to ignore
//   //   // the <DisabledContext> but not the Layered Focus State.
//   //   // If we want to enforce `disabled=false` by ignoring layer focus,
//   //   // then the button should be placed in a different <FocusLayer>.
//   //   return useDerivedDisabledState(isFocused ? disabled : true)
//   // }

//   // #endregion Internal methods

// }

// // #region Static helpers

// // function withCoreUIPrefix(value: string): string {
// //   return 'core-ui-' + value
// // }

// // function warnIfKeyIsInvalid(key: string): void {
// //   if (IS_DEBUG_ENV) {
// //     if (!/^[a-z0-9_-]+$/i.test(key)) {
// //       devWarn(`Keys should only contain alphanumeric characters, dashes, and/or underscores but received "${key}"`)
// //     }
// //   }
// // }

// // #endregion Static helpers

// // #region Miscellaneous exports
// export * from './abstractions/public'
// // #endregion Miscellaneous exports

export { }
