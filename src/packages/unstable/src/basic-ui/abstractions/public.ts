import { IInput } from '@glyph-cat/swiss-army-knife-react'
import { ChangeEvent, ForwardRefExoticComponent, ReactNode, RefAttributes } from 'react'

/**
 * @public
 */
export type IBasicUIComponent<Props, AugmentedElement extends HTMLElement> = ForwardRefExoticComponent<Omit<Props, 'ref'> & RefAttributes<AugmentedElement>>

/**
 * @public
 */
export interface CheckboxProps {
  label?: ReactNode
  checked: boolean | 'indeterminate'
  onChange(newChecked: boolean, event: ChangeEvent<HTMLInputElement>): void
  /**
   * @defaultValue `false`
   */
  disabled?: boolean
  /**
   * @defaultValue `false`
   */
  loading?: boolean
  /**
   * @defaultValue `'m'`
   */
  size?: 's' | 'm' | 'l'
}

/**
 * @public
 */
export type ICheckbox = IInput

/**
 * @public
 */
export type ICheckboxComponent = IBasicUIComponent<CheckboxProps, ICheckbox>
