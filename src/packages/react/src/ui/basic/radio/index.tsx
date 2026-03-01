import { injectInlineCSSVariables } from '@glyph-cat/css-utils'
import { LenientString, Nullable } from '@glyph-cat/foundation'
import { Color } from '@glyph-cat/swiss-army-knife'
import clsx from 'clsx'
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
import { View } from '../../core'
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
  disabled: Nullable<boolean>
  onChange(newValue: Value, event: ChangeEvent<HTMLInputElement>): void
  itemFlow: BasicUIFlow
  position: BasicUIPosition
}

const RadioGroupContext = createContext<Nullable<IRadioGroupContext<unknown>>>(null)

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

  const effectiveSize = (size && RADIO_GROUP_SIZE_PRESETS[size]) ?? RADIO_GROUP_SIZE_PRESETS.m

  const containerRef = useRef<View>(null!)
  useEffect(() => {
    const tintSource = new Color(tint)
    return injectInlineCSSVariables({
      [__SIZE]: effectiveSize,
      [__TINT]: tint,
      [__TINT_40]: tintSource.asRGB().transform((prevValues) => ({
        ...prevValues,
        a: 0.4,
      })).toString(),
      [__TINT_STRONGER]: tintSource.asHSL().transform((prevValues) => ({
        ...prevValues,
        l: prevValues.l * 1.2
      })).toString(),
    }, containerRef.current)
  }, [effectiveSize, tint])

  return (
    <View
      ref={containerRef}
      className={clsx(
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
  const context = useContext(RadioGroupContext)
  if (!context) {
    throw new Error('<RadioItem> must be used within a <RadioGroup>')
  }
  const {
    value: currentValue,
    onChange,
    position,
    itemFlow,
    disabled: isParentDisabled,
  } = context
  return (
    <label
      className={clsx(
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
      <input
        className={styles.input}
        // NOTE: `value` is omitted, in this custom component, the proper way is
        // to use the first parameter of `onChange`, not `event.target.value`.
        // Hence adding `value={String(value)}` would make no sense.
        checked={Object.is(value, currentValue)}
        disabled={Boolean(disabled || isParentDisabled)}
        onChange={useCallback((e: ChangeEvent<HTMLInputElement>) => {
          onChange(value, e)
        }, [onChange, value])}
        type='radio'
      />
      {position === BASIC_UI_POSITION_START && <View>{children}</View>}
    </label>
  )
}

__setDisplayName(RadioItem)
