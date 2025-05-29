import {
  c,
  Color,
  ColorFormat,
  injectInlineCSSVariables,
  isUndefinedOrNull,
  LenientString,
} from '@glyph-cat/swiss-army-knife'
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
import { __setDisplayName } from '../../../_internals'
import { MaterialSymbol } from '../../../material-symbols'
import { useThemeContext } from '../../../styling'
import { Input, View } from '../../core'
import { useDataMounted } from '../_internals/data-mounted'
import { resolveContrastingValue } from '../_internals/resolve-contrasting-color'
import { tryResolvePaletteColor } from '../_internals/try-resolve-palette-color'
import { BasicUIColor, BasicUIFlow, BasicUIPosition, BasicUISize } from '../abstractions'
import {
  __SIZE,
  __TINT,
  __TINT_40,
  __TINT_STRONGER,
  BASIC_UI_FLOW_COLUMN,
  BASIC_UI_FLOW_ROW,
  BASIC_UI_POSITION_END,
  BASIC_UI_POSITION_START,
} from '../constants'
import { ProgressRing } from '../progress-ring'
import { styles } from './styles'

export const CHECKBOX_SIZE_PRESETS: Record<BasicUISize, [
  boxSize: number,
  iconSize: number,
  spinnerSize: number,
]> = {
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
   * @defaultValue `'column'`
   */
  flow?: BasicUIFlow
  /**
   * Position of the checkbox relative to its children, if any.
   * @defaultValue `'start'`
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
  position = BASIC_UI_POSITION_START,
}: CheckboxProps, forwardedRef: ForwardedRef<Checkbox>): JSX.Element => {

  const { palette } = useThemeContext()
  const tint = tryResolvePaletteColor($color, palette)

  const [boxSize, iconSize, spinnerSize] = CHECKBOX_SIZE_PRESETS[size] ?? CHECKBOX_SIZE_PRESETS.m
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

  useDataMounted(inputRef)

  const containerRef = useRef<HTMLLabelElement>(null)
  useEffect(() => {
    const tintSource = Color.fromString(tint)
    return injectInlineCSSVariables({
      [__SIZE]: boxSize,
      [__TINT]: tint,
      [__TINT_40]: Color.fromRGBObject({
        red: tintSource.red,
        blue: tintSource.blue,
        green: tintSource.green,
        alpha: 0.4,
      }).toString(ColorFormat.FFFFFFFF),
      [__TINT_STRONGER]: Color.fromHSLObject({
        hue: tintSource.hue,
        saturation: tintSource.saturation,
        lightness: tintSource.lightness * 1.2,
      }).toString(ColorFormat.FFFFFFFF),
    }, containerRef.current)
  }, [tint, boxSize])

  return (
    <label
      ref={containerRef}
      className={c(
        styles.container,
        flow === BASIC_UI_FLOW_ROW ? styles.flowRow : styles.flowColumn,
      )}
    >
      {(position === BASIC_UI_POSITION_END && children) && <View>{children}</View>}
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
      {(position === BASIC_UI_POSITION_START && children) && <View>{children}</View>}
    </label>
  )
})

__setDisplayName(Checkbox)
