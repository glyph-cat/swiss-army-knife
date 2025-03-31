import {
  Color,
  ColorFormat,
  getPercentage,
  injectInlineCSSVariables,
  isNumber,
  LenientString,
  px,
} from '@glyph-cat/swiss-army-knife'
import { useThemeContext } from '@glyph-cat/swiss-army-knife-react'
import { __assignDisplayName } from 'packages/react/src/_internals'
import { JSX, useEffect, useRef } from 'react'
import { View } from '~core-ui'
import { tryResolvePaletteColor } from '../_internals/try-resolve-palette-color'
import { BasicUIColor, BasicUISize } from '../abstractions'
import { KEY_SIZE, KEY_TINT, KEY_TINT_40 } from '../constants'
import { KEY_PROGRESS_BY_ANGLE, KEY_THICKNESS, styles } from './styles'

const sizePresets: Record<BasicUISize, number> = {
  's': 32,
  'm': 48,
  'l': 64,
} as const

/**
 * @public
 */
export interface SpinnerProps {
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
   * @defaultValue `'primary'`
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
   * Display the tip with a clean line instead of a rounded cap.
   * @defaultValue `false`
   */
  precise?: boolean
}

/**
 * @public
 */
export interface Spinner extends HTMLProgressElement {
  (props: SpinnerProps): JSX.Element
}

export function Spinner({
  value,
  minValue = 0,
  maxValue = 100,
  color: $color,
  size,
  thickness = 6,
  precise = false,
}: SpinnerProps): JSX.Element {

  const { palette } = useThemeContext()

  const tint = Color.fromString(tryResolvePaletteColor($color, palette)).toString(ColorFormat.FFFFFF, {
    suppressAlphaInShortFormats: true,
  })
  const effectiveSize = isNumber(size) ? size : (sizePresets[size] ?? sizePresets.m)
  const indeterminate = !isNumber(value)
  const progressByAngle = 360 * getPercentage(value, minValue, maxValue)

  const containerRef = useRef<View>(null)
  useEffect(() => {
    return injectInlineCSSVariables({
      [KEY_TINT]: tint,
      [KEY_TINT_40]: `${tint}40`,
      [KEY_SIZE]: effectiveSize,
      [KEY_THICKNESS]: px(thickness),
      ...(indeterminate ? {} : { [KEY_PROGRESS_BY_ANGLE]: `${progressByAngle}deg` })
    }, containerRef.current)
  }, [effectiveSize, indeterminate, progressByAngle, thickness, tint])

  return (
    <View
      ref={containerRef}
      className={styles.container}
      role='progressbar'
      aria-valuemin={minValue}
      aria-valuemax={maxValue}
      {...indeterminate ? {
        'aria-busy': true,
      } : {
        'aria-valuenow': value,
      }}
    >
      {!precise && (
        <>
          <View className={styles.cap} />
          <View className={styles.trailingCapContainer}>
            <View className={styles.cap} />
          </View>
        </>
      )}
    </View>
  )
}

__assignDisplayName(Spinner)
