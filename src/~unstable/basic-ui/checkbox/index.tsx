import {
  c,
  Color,
  ColorFormat,
  ColorUtil,
  injectCSSVariables,
  isUndefinedOrNull,
  LenientString,
} from '@glyph-cat/swiss-army-knife'
import { Input, MaterialSymbol, useThemeContext, View } from '@glyph-cat/swiss-army-knife-react'
import {
  ChangeEvent,
  ForwardedRef,
  forwardRef,
  JSX,
  ReactNode,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
} from 'react'
import { BasicUIColor, BasicUISize } from '../abstractions'
import { tryResolvePaletteColor } from '../internals/try-resolve-palette-color'
import styles from './index.module.css'

const sizeStyle: Record<BasicUISize, string> = {
  's': styles.containerSizeS,
  'm': styles.containerSizeM,
  'l': styles.containerSizeL,
}

const presetSize: Record<BasicUISize, number> = {
  's': 20,
  'm': 24,
  'l': 26,
}

const INDETERMINATE = 'indeterminate'

/**
 * @public
 */
export type CheckedValue = boolean | 'indeterminate'

/**
 * @public
 */
export interface CheckboxProps {
  label?: ReactNode
  checked?: CheckedValue
  onChange?(newChecked: boolean, event: ChangeEvent<HTMLInputElement>): void
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
  size?: BasicUISize
  /**
   * @defaultValue `'primary'`
   */
  color?: LenientString<BasicUIColor>
}

/**
 * @public
 */
export type Checkbox = Input

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
  color: $color,
}: CheckboxProps, forwardedRef: ForwardedRef<Checkbox>): JSX.Element => {
  const { palette } = useThemeContext()
  const disabled = $disabled ?? loading

  // TODO: Loading indicator
  const inputRef = useRef<Input>(null)
  useImperativeHandle(forwardedRef, () => inputRef.current, [])
  useEffect(() => {
    const target = inputRef.current
    const enforceIndeterminateState = () => { target.indeterminate = checked === INDETERMINATE }
    enforceIndeterminateState()
    target.addEventListener('change', enforceIndeterminateState)
    return () => { target.removeEventListener('change', enforceIndeterminateState) }
  }, [checked])

  const containerRef = useRef<HTMLLabelElement>(null)
  const color = $color ? tryResolvePaletteColor($color, palette) : palette.primaryColor
  useEffect(() => {
    const colorSource = Color.fromString(color)
    injectCSSVariables({
      'checkboxColor': color,
      'checkboxColor40': Color.fromRGBObject({
        red: colorSource.red,
        blue: colorSource.blue,
        green: colorSource.green,
        alpha: 0.4,
      }).toString(ColorFormat.FFFFFFFF),
      'checkboxColorFilledHover': Color.fromHSLObject({
        hue: colorSource.hue,
        saturation: colorSource.saturation,
        lightness: colorSource.lightness * 1.2,
      }).toString(ColorFormat.FFFFFFFF),
    }, containerRef.current)
  }, [color])

  return (
    <label
      ref={containerRef}
      className={c(
        styles.container,
        sizeStyle[size] ?? sizeStyle.m,
      )}
    >
      <View className={styles.checkbox}>
        <Input
          ref={inputRef}
          className={styles.input}
          type='checkbox'
          {...(isUndefinedOrNull(checked) ? {} : { checked: checked === true })}
          onChange={useCallback((e) => { onChange?.(e.target.checked, e) }, [onChange])}
          disabled={disabled}
        />
        <View className={styles.checkmark}>
          <MaterialSymbol
            name={checked === INDETERMINATE ? 'remove' : 'check'}
            // These props should not be affected by any provider:
            renderAs='span'
            size={presetSize[size] ?? presetSize.m}
            color={resolveContrastingValue(palette.primaryColor)}
            {...(size === 's' ? { grade: 200 } : {})}
          />
        </View>
      </View>
      {label && <View>{label}</View>}
    </label>
  )
})

const resolveContrastingValue = ColorUtil.createContrastingValue({
  light: '#000000',
  dark: '#ffffff',
})
