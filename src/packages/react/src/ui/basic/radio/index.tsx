import {
  c,
  Color,
  ColorFormat,
  injectInlineCSSVariables,
  LenientString,
} from '@glyph-cat/swiss-army-knife'
import {
  ChangeEvent,
  createContext,
  JSX,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
} from 'react'
import { __setDisplayName } from '../../../_internals'
import { useThemeContext } from '../../../styling'
import { Input, View } from '../../core'
import { useInternalDerivedDisabledState } from '../../core/components/_internals'
import { tryResolvePaletteColor } from '../_internals/try-resolve-palette-color'
import { BasicUIColor, BasicUIFlow, BasicUIPosition, BasicUISize } from '../abstractions'
import {
  __SIZE,
  __TINT,
  __TINT_40,
  __TINT_STRONGER,
  BASIC_UI_FLOW_ROW,
  BASIC_UI_POSITION_END,
  BASIC_UI_POSITION_START,
} from '../constants'
import { styles } from './styles'

interface IRadioGroupContext<Value> {
  value: Value
  disabled: boolean
  onChange(newValue: Value, event: ChangeEvent<HTMLInputElement>): void
  position: BasicUIPosition
}

const RadioGroupContext = createContext<IRadioGroupContext<unknown>>(null)

const sizePresets: Record<BasicUISize, number> = {
  's': 22,
  'm': 28,
  'l': 32,
} as const

// TODO: replace all '@internal' with '@public' when API is ready

/**
 * @internal
 */
export interface RadioGroupProps<Value> {
  children?: ReactNode
  value: Value
  onChange(newValue: Value, event: ChangeEvent<HTMLInputElement>): void
  disabled?: boolean
  /**
   * @defaultValue `'m'`
   */
  size?: BasicUISize
  /**
   * @defaultValue `'primary'`
   */
  color?: LenientString<BasicUIColor>
  /**
   * @defaultValue `'row'`
   */
  flow?: BasicUIFlow
  /**
   * Position of the checkbox relative to its children if any.
   * @defaultValue `'start'`
   */
  position?: BasicUIPosition
  // TODO: itemFlow
  // TODO: itemPosition
}

/**
 * @internal
 */
export function RadioGroup<Value>({
  children,
  value,
  onChange,
  disabled: $disabled,
  size,
  color: $color,
  flow = BASIC_UI_FLOW_ROW,
  position = BASIC_UI_POSITION_START,
}: RadioGroupProps<Value>): JSX.Element {
  const disabled = useInternalDerivedDisabledState($disabled)
  const contextValue = useMemo<IRadioGroupContext<Value>>(() => ({
    value,
    disabled,
    onChange,
    position,
  }), [disabled, onChange, position, value])

  const { palette } = useThemeContext()
  const tint = tryResolvePaletteColor($color, palette)

  const effectiveSize = sizePresets[size] ?? sizePresets.m

  const containerRef = useRef<View>(null)
  useEffect(() => {
    const tintSource = Color.fromString(tint)
    return injectInlineCSSVariables({
      [__SIZE]: effectiveSize,
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
  }, [effectiveSize, tint])

  return (
    <View
      ref={containerRef}
      className={c(
        styles.container,
        flow === BASIC_UI_FLOW_ROW ? styles.flowRow : styles.flowColumn,
      )}
    >
      <RadioGroupContext value={contextValue}>
        {children}
      </RadioGroupContext>
    </View>
  )
}

__setDisplayName(RadioGroup)

/**
 * @internal
 */
export interface RadioItemProps<Value> {
  value: Value
  children?: ReactNode
  disabled?: boolean
}

/**
 * @internal
 */
export function RadioItem<Value>({
  value,
  children,
  disabled,
}: RadioItemProps<Value>): JSX.Element {
  const {
    value: currentValue,
    disabled: isParentDisabled,
    onChange,
    position,
  } = useContext(RadioGroupContext)
  return (
    <label className={styles.label}>
      {position === BASIC_UI_POSITION_END && <View>{children}</View>}
      <Input
        className={styles.input}
        // NOTE: `value` is omitted, in this custom component, the proper way is
        // to use the first parameter of `onChange`, not `event.target.value`.
        // Hence adding `value={String(value)}` would make no sense.
        checked={Object.is(value, currentValue)}
        disabled={disabled || isParentDisabled}
        onChange={useCallback((e) => { onChange(value, e) }, [onChange, value])}
        type='radio'
      />
      {position === BASIC_UI_POSITION_START && <View>{children}</View>}
    </label>
  )
}

__setDisplayName(RadioItem)
