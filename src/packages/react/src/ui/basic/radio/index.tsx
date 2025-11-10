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
  BASIC_UI_FLOW_COLUMN,
  BASIC_UI_FLOW_ROW,
  BASIC_UI_POSITION_END,
  BASIC_UI_POSITION_START,
} from '../constants'
import { RADIO_GROUP_SIZE_PRESETS } from './constants'
import { styles } from './styles'

interface IRadioGroupContext<Value> {
  value: Value
  disabled: boolean
  onChange(newValue: Value, event: ChangeEvent<HTMLInputElement>): void
  itemFlow: BasicUIFlow
  position: BasicUIPosition
}

const RadioGroupContext = createContext<IRadioGroupContext<unknown>>(null)



/**
 * @public
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
   * Position of the radio buttons relative to their children, if any.
   * @defaultValue `'start'`
   */
  position?: BasicUIPosition
  /**
   * @defaultValue `'column'`
  */
  itemFlow?: BasicUIFlow
}

/**
 * @public
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
  itemFlow = BASIC_UI_FLOW_COLUMN,
}: RadioGroupProps<Value>): JSX.Element {
  const disabled = useInternalDerivedDisabledState($disabled)
  const contextValue = useMemo<IRadioGroupContext<Value>>(() => ({
    value,
    disabled,
    onChange,
    position,
    itemFlow,
  }), [value, disabled, onChange, itemFlow, position])

  const { palette } = useThemeContext()
  const tint = tryResolvePaletteColor($color, palette, palette.primaryColor)

  const effectiveSize = RADIO_GROUP_SIZE_PRESETS[size] ?? RADIO_GROUP_SIZE_PRESETS.m

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
      style={flow === BASIC_UI_FLOW_ROW ? {
        justifyItems: position,
      } : {
        alignItems: position,
      }}
    >
      <RadioGroupContext value={contextValue}>
        {children}
      </RadioGroupContext>
    </View>
  )
}

__setDisplayName(RadioGroup)

/**
 * @public
 */
export interface RadioItemProps<Value> {
  value: Value
  children?: ReactNode
  disabled?: boolean
}

/**
 * @public
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
    itemFlow,
    position,
  } = useContext(RadioGroupContext)
  return (
    <label
      className={c(
        styles.label,
        itemFlow === BASIC_UI_FLOW_ROW ? styles.labelFlowRow : styles.labelFlowColumn,
      )}
      style={itemFlow === BASIC_UI_FLOW_COLUMN ? {
        justifyItems: position,
      } : {
        alignItems: position,
      }}
    >
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
