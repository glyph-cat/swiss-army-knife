import { c, injectInlineCSSVariables, px } from '@glyph-cat/css-utils'
import { LenientString } from '@glyph-cat/foundation'
import { Color, ColorFormat, getPercentage } from '@glyph-cat/swiss-army-knife'
import { isNumber } from '@glyph-cat/type-checking'
import { ForwardedRef, forwardRef, JSX, useEffect, useImperativeHandle, useRef } from 'react'
import { __setDisplayName } from '../../../_internals'
import { useThemeContext } from '../../../styling'
import { View, ViewProps } from '../../core'
import { tryResolvePaletteColor } from '../_internals/try-resolve-palette-color'
import { BasicUIColor, BasicUISize } from '../abstractions'
import { __SIZE, __TINT, __TINT_40 } from '../constants'
import { __ANGLE, __THICKNESS, styles } from './styles'

const sizePresets: Readonly<Record<BasicUISize, number>> = {
  's': 32,
  'm': 48,
  'l': 64,
}

/**
 * @public
 */
export interface ProgressRingProps extends ViewProps {
  /**
   * The current progress value.
   * This must be a value equal to or between `minValue` and `maxValue`.
   * Omit this parameter to indicate an indeterminate state.
   * @defaultValue `undefined`
   */
  value?: number
  /**
   * @defaultValue `0`
   */
  minValue?: number
  /**
   * @defaultValue `100`
   */
  maxValue?: number
  /**
   * @defaultValue `'#808080'`
   */
  color?: LenientString<BasicUIColor>
  /**
   * @defaultValue `'m'`
   */
  size?: BasicUISize | number
  /**
   * @defaultValue `6`
   */
  thickness?: number
  /**
   * @defaultValue `'progressbar'`
   */
  role?: 'progressbar' | 'meter'
  /**
   * @defaultValue `false`
   */
  allowOvershoot?: boolean
}

/**
 * @public
 */
export interface ProgressRing extends View {
  (props: ProgressRingProps): JSX.Element
}

/**
 * @public
 */
export const ProgressRing = forwardRef(({
  value,
  minValue = 0,
  maxValue = 100,
  color: $color,
  size,
  thickness = 6,
  role = 'progressbar',
  allowOvershoot = false,
  className,
  ...props
}: ProgressRingProps, forwardedRef: ForwardedRef<View>): JSX.Element => {

  const { palette } = useThemeContext()

  const tint = Color
    .fromString(tryResolvePaletteColor($color, palette, palette.primaryColor))
    .toString(ColorFormat.FFFFFF, { suppressAlphaInShortFormats: true })
  const effectiveSize = isNumber(size) ? size : (sizePresets[size] ?? sizePresets.m)
  const indeterminate = !isNumber(value)
  let clampedValue = Math.max(minValue, value)
  if (!allowOvershoot) { clampedValue = Math.min(value, maxValue) }
  const angle = indeterminate ? 0 : 360 * getPercentage(clampedValue, minValue, maxValue)
  // const angle = indeterminate ? 0 : (360 * getPercentage(clampedValue, minValue, maxValue)) % 360
  // KIV: Do we need % 360? (and assign background color to the ring when > 360)

  const containerRef = useRef<View>(null)
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
      [__SIZE]: effectiveSize,
      [__THICKNESS]: px(thickness),
      ...(indeterminate ? {} : { [__ANGLE]: `${angle}deg` })
    }, containerRef.current)
  }, [angle, effectiveSize, indeterminate, thickness, tint])

  useImperativeHandle(forwardedRef, () => containerRef.current, [])

  return (
    <View
      ref={containerRef}
      className={c(styles.container, className)}
      role={role}
      aria-valuemin={minValue}
      aria-valuemax={maxValue}
      {...indeterminate ? {
        'aria-busy': true,
      } : {
        'aria-valuenow': value,
      }}
      {...props}
    >
      <View className={styles.cap} />
      <View className={styles.trailingCapContainer}>
        <View className={c(
          styles.cap,
          allowOvershoot ? styles.capWithShadow : null,
        )} />
      </View>
    </View>
  )
})

__setDisplayName(ProgressRing)
