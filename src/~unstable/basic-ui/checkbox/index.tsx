import {
  c,
  Color,
  ColorFormat,
  ColorUtil,
  injectInlineCSSVariables,
  isUndefinedOrNull,
  LenientString,
} from '@glyph-cat/swiss-army-knife'
import {
  Input,
  MaterialSymbol,
  useThemeContext,
  View,
} from '@glyph-cat/swiss-army-knife-react'
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
import { tryResolvePaletteColor } from '../_internals/try-resolve-palette-color'
import { BasicUIColor, BasicUIFlow, BasicUIPosition, BasicUISize } from '../abstractions'
import { ProgressRing } from '../progress-ring'
import {
  BASIC_UI_FLOW_COLUMN,
  BASIC_UI_FLOW_ROW,
  BASIC_UI_POSITION_END,
  BASIC_UI_POSITION_START,
  KEY_SIZE,
  KEY_TINT,
  KEY_TINT_40,
  KEY_TINT_HOVER,
} from '../constants'
import { styles } from './styles'

const sizePresets: Record<BasicUISize, [boxSize: number, iconSize: number, spinnerSize: number]> = {
  's': [22, 20, 14],
  'm': [28, 24, 18],
  'l': [32, 26, 22],
} as const

const INDETERMINATE = 'indeterminate'

/**
 * @public
 */
export type CheckboxValue = boolean | 'indeterminate'

/**
 * @public
 */
export interface CheckboxProps {
  children?: ReactNode
  value?: CheckboxValue
  onChange?(newValue: boolean, event: ChangeEvent<HTMLInputElement>): void
  /**
   * @defaultValue `false`
   */
  disabled?: boolean
  /**
   * @defaultValue `false`
   */
  busy?: boolean
  /**
   * @defaultValue `'m'`
   */
  size?: BasicUISize
  /**
   * @defaultValue `'primary'`
   */
  color?: LenientString<BasicUIColor>
  /**
   * @defaultValue `BasicUIFlow.INLINE`
   */
  flow?: BasicUIFlow
  /**
   * @defaultValue `BasicUIPosition.END`
   */
  position?: BasicUIPosition
}

/**
 * @public
 */
export type Checkbox = Input

/**
 * @public
 */
export const Checkbox = forwardRef(({
  children,
  value,
  onChange,
  disabled: $disabled,
  busy,
  size,
  color: $color,
  flow = BASIC_UI_FLOW_COLUMN,
  position = BASIC_UI_POSITION_END,
}: CheckboxProps, forwardedRef: ForwardedRef<Checkbox>): JSX.Element => {

  const { palette } = useThemeContext()
  const color = tryResolvePaletteColor($color, palette)

  const [boxSize, iconSize, spinnerSize] = sizePresets[size] ?? sizePresets.m
  const disabled = $disabled ?? busy

  const inputRef = useRef<Input>(null)
  useImperativeHandle(forwardedRef, () => inputRef.current, [])
  useEffect(() => {
    const target = inputRef.current
    const enforceIndeterminateState = () => { target.indeterminate = value === INDETERMINATE }
    enforceIndeterminateState()
    target.addEventListener('change', enforceIndeterminateState)
    return () => { target.removeEventListener('change', enforceIndeterminateState) }
  }, [value])

  const containerRef = useRef<HTMLLabelElement>(null)
  useEffect(() => {
    const colorSource = Color.fromString(color)
    return injectInlineCSSVariables({
      [KEY_SIZE]: boxSize,
      [KEY_TINT]: color,
      [KEY_TINT_40]: Color.fromRGBObject({
        red: colorSource.red,
        blue: colorSource.blue,
        green: colorSource.green,
        alpha: 0.4,
      }).toString(ColorFormat.FFFFFFFF),
      [KEY_TINT_HOVER]: Color.fromHSLObject({
        // NOTE: Used to be called `checkboxColorFilledHover`
        hue: colorSource.hue,
        saturation: colorSource.saturation,
        lightness: colorSource.lightness * 1.2,
      }).toString(ColorFormat.FFFFFFFF),
    }, containerRef.current)
  }, [color, boxSize])

  return (
    <label
      ref={containerRef}
      className={c(
        styles.container,
        flow === BASIC_UI_FLOW_ROW ? styles.flowRow : styles.flowColumn,
      )}
    >
      {(position === BASIC_UI_POSITION_START && children) && <View>{children}</View>}
      <View className={styles.checkbox}>
        <Input
          ref={inputRef}
          className={styles.input}
          type='checkbox'
          {...(isUndefinedOrNull(value) ? {} : { checked: value === true })}
          onChange={useCallback((e) => { onChange?.(e.target.checked, e) }, [onChange])}
          disabled={disabled}
        />
        {busy
          ? <View className={styles.busy}>
            <ProgressRing size={spinnerSize} thickness={3} color='#808080' />
          </View>
          : <View className={styles.checkmark}>
            <MaterialSymbol
              name={value === INDETERMINATE ? 'remove' : 'check'}
              // These props should not be affected by any provider:
              renderAs='span'
              size={iconSize}
              color={resolveContrastingValue(palette.primaryColor)}
              {...(size === 's' ? { grade: 200 } : {})}
            />
          </View>
        }
      </View>
      {(position === BASIC_UI_POSITION_END && children) && <View>{children}</View>}
    </label>
  )
})

const resolveContrastingValue = ColorUtil.createContrastingValue({
  light: '#000000',
  dark: '#ffffff',
})
