import { ForwardRefExoticComponent, JSX, RefAttributes } from 'react'
import { DisabledContext } from '../../disabled-context'
import { InputFocusTracker } from '../../input-focus'
import { LayeredFocusManager } from '../../layered-focus'

/**
 * @public
 */
export type ICoreUIComponent<Props, AugmentedElement extends HTMLElement> = ForwardRefExoticComponent<Omit<Props, 'ref'> & RefAttributes<AugmentedElement>>

/**
 * @public
 */
export type ViewProps = JSX.IntrinsicElements['div']

/**
 * @public
 */
export interface IView extends HTMLDivElement { (props: ViewProps): JSX.Element }

/**
 * @public
 */
export type IViewComponent = ICoreUIComponent<ViewProps, HTMLDivElement>

/**
 * @public
 */
export type FocusableViewProps = JSX.IntrinsicElements['div'] & {
  /**
   * @defaultValue `true`
   */
  allowRefocus?: boolean
  /**
   * @defaultValue `true`
  */
  effective?: boolean
  /**
   * @defaultValue `false`
   */
  ignoreSiblings?: boolean
}

/**
 * @public
 */
export interface IFocusableView extends HTMLDivElement { (props: FocusableViewProps): JSX.Element }

/**
 * @public
 */
export type IFocusableViewComponent = ICoreUIComponent<FocusableViewProps, HTMLDivElement>

/**
 * @public
 */
export type InputProps = JSX.IntrinsicElements['input']

/**
 * @public
 */
export interface IInput extends HTMLInputElement { (props: InputProps): JSX.Element }

/**
 * @public
 */
export type IInputComponent = ICoreUIComponent<InputProps, HTMLInputElement>

/**
 * @public
 */
export type TextAreaProps = JSX.IntrinsicElements['textarea']

/**
 * @public
 */
export interface ITextArea extends HTMLTextAreaElement { (props: TextAreaProps): JSX.Element }

/**
 * @public
 */
export type ITextAreaComponent = ICoreUIComponent<TextAreaProps, HTMLTextAreaElement>

/**
 * @public
 */
export type ButtonProps = JSX.IntrinsicElements['button']

/**
 * @public
 */
export interface IButton extends HTMLButtonElement { (props: ButtonProps): JSX.Element }

/**
 * @public
 */
export type IButtonComponent = ICoreUIComponent<ButtonProps, HTMLButtonElement>

/**
 * @public
 */
export type SelectProps = JSX.IntrinsicElements['select']

/**
 * @public
 */
export interface ISelect extends HTMLSelectElement { (props: SelectProps): JSX.Element }

/**
 * @public
 */
export type ISelectComponent = ICoreUIComponent<SelectProps, HTMLSelectElement>

/**
 * @public
 */
export type FieldSetProps = JSX.IntrinsicElements['fieldset']

/**
 * @public
 */
export interface IFieldSet extends HTMLSelectElement { (props: FieldSetProps): JSX.Element }

/**
 * @public
 */
export type IFieldSetComponent = ICoreUIComponent<FieldSetProps, HTMLFieldSetElement>

/**
 * @public
 */
export interface CoreUIComposerConfigs {
  disabledContext: DisabledContext
  inputFocusTracker: InputFocusTracker
  layeredFocusManager: LayeredFocusManager
}
