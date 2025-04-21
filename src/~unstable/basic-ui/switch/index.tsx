import {
  Color,
  ColorFormat,
  injectInlineCSSVariables,
  isNumber,
  LenientString,
} from '@glyph-cat/swiss-army-knife'
import { ButtonBase, useThemeContext, View } from '@glyph-cat/swiss-army-knife-react'
import {
  FormEvent,
  forwardRef,
  JSX,
  ReactNode,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
} from 'react'
import { useDataMounted } from '../_internals/data-mounted'
import { tryResolvePaletteColor } from '../_internals/try-resolve-palette-color'
import { BasicUIColor, BasicUIPosition, BasicUISize } from '../abstractions'
import {
  __SIZE,
  __TINT,
  __TINT_40,
  __TINT_STRONGER,
  BASIC_UI_POSITION_END,
  BASIC_UI_POSITION_START,
} from '../constants'
import { ProgressRing, ProgressRingProps } from '../progress-ring'
import { styles } from './styles'

const sizePresets: Readonly<Record<BasicUISize, number>> = {
  's': 24,
  'm': 30,
  'l': 34,
}

const progressRingPresets: Readonly<Record<BasicUISize, Partial<Omit<ProgressRingProps, 'ref'>>>> = {
  's': {
    size: 12,
    thickness: 3,
  },
  'm': {
    size: 16,
    thickness: 3.4,
  },
  'l': {
    size: 20,
    thickness: 4,
  },
}

/**
 * @public
 */
export interface SwitchProps {
  children?: ReactNode
  value?: boolean
  onChange?(newValue: boolean, event: FormEvent<HTMLButtonElement>): void
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
   * Position of the switch relative to its children if any.
   * @defaultValue `'start'`
   */
  position?: BasicUIPosition
  /**
   * @defaultValue `{}`
   */
  ProgressRingProps?: Partial<Omit<ProgressRingProps, 'ref'>>
}

/**
 * @public
 */
export type Switch = ButtonBase

/**
 * @public
 */
export const Switch = forwardRef(({
  children,
  value,
  onChange,
  disabled: $disabled,
  busy,
  size,
  color: $color,
  position = BASIC_UI_POSITION_END,
  ProgressRingProps: progressRingProps = {},
}: SwitchProps, forwardedRef): JSX.Element => {

  const { palette } = useThemeContext()
  const tint = tryResolvePaletteColor($color, palette)

  const disabled = $disabled ?? busy

  const effectiveSize = isNumber(size) ? size : (sizePresets[size] ?? sizePresets.m)
  const effectiveProgressRingPresets = progressRingPresets[size] ?? progressRingPresets.m

  const buttonRef = useRef<ButtonBase>(null)
  useImperativeHandle(forwardedRef, () => buttonRef.current, [])
  useDataMounted(buttonRef)

  const containerRef = useRef<HTMLLabelElement>(null)
  useEffect(() => {
    const tintSource = Color.fromString(tint)
    return injectInlineCSSVariables({
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
      [__SIZE]: effectiveSize,
    }, containerRef.current)
  }, [tint, effectiveSize])

  return (
    <label ref={containerRef} className={styles.container}>
      {(position === BASIC_UI_POSITION_END && children) && <View>{children}</View>}
      <ButtonBase
        className={styles.button}
        ref={buttonRef}
        type='button'
        role='switch'
        aria-checked={value}
        onClick={useCallback((e) => { onChange?.(!value, e) }, [onChange, value])}
        disabled={disabled}
      >
        <View
          className={styles.thumb}
          style={busy ? { backgroundColor: 'transparent' } : {}}
        >
          {busy && (
            <ProgressRing
              color='#808080'
              {...effectiveProgressRingPresets}
              {...progressRingProps}
            />
          )}
        </View>
      </ButtonBase>
      {(position === BASIC_UI_POSITION_START && children) && <View>{children}</View>}
    </label>
  )
})
