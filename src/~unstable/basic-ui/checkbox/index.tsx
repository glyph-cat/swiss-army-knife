import { c } from '@glyph-cat/swiss-army-knife'
import { Input, MaterialSymbol, View } from '@glyph-cat/swiss-army-knife-react'
import { ChangeEvent, ForwardedRef, forwardRef, JSX, ReactNode, useCallback } from 'react'
import styles from './index.module.css'

const sizeStyle: Record<CheckboxProps['size'], string> = {
  's': styles.containerSizeS,
  'm': styles.containerSizeM,
  'l': styles.containerSizeL,
}

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
export type ICheckbox = Input

/**
 * @public
 */
export const Checkbox = forwardRef(({
  label,
  checked,
  onChange,
  disabled: $disabled,
  loading,
  size,
}: CheckboxProps, ref: ForwardedRef<ICheckbox>): JSX.Element => {
  const disabled = $disabled ?? loading
  return (
    <label className={c(
      styles.container,
      sizeStyle[size] ?? sizeStyle.m,
    )}>
      <View className={styles.checkbox}>
        <Input
          ref={ref}
          className={styles.input}
          type='checkbox'
          checked={checked === true}
          onChange={useCallback((e) => { onChange(e.target.checked, e) }, [onChange])}
          disabled={disabled}
        />
        <View className={styles.checkmark}>
          <MaterialSymbol name='check' />
        </View>
      </View>
      {label && <View>{label}</View>}
    </label>
  )
})
