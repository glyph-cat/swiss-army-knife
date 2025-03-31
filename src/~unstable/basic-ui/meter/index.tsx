import {
  c,
  getPercentage,
  injectInlineCSSVariables,
  isNumber,
  LenientString,
  percent,
  serializePixelValue,
} from '@glyph-cat/swiss-army-knife'
import { useThemeContext, View } from '@glyph-cat/swiss-army-knife-react'
import { JSX, useEffect, useRef } from 'react'
import { tryResolvePaletteColor } from '../_internals/try-resolve-palette-color'
import { BasicUIColor, BasicUILayout, BasicUISize } from '../abstractions'
import {
  createMeterBasedLayoutPresets,
  KEY_CONTAINER_BORDER_RADIUS,
  KEY_DIRECTION_MULTIPLIER,
  KEY_FILL_BORDER_RADIUS,
  KEY_SIZE,
  KEY_TINT,
  meterBasedSizePresets as sizePresets,
} from '../constants'
import { styles } from './styles'

const layoutPresets = createMeterBasedLayoutPresets(styles.layoutH, styles.layoutV)

export interface MeterProps {
  /**
   * The current meter value.
   * This must be a value equal to or between `minValue` and `maxValue`.
   * @defaultValue `0`
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
   * @defaultValue `'horizontal'`
   */
  layout?: BasicUILayout
  /**
   * @defaultValue `false`
   */
  reverse?: boolean
  /**
   * @defaultValue `'50%'`
   */
  borderRadius?: number | string
}

export function Meter({
  value = 0,
  minValue = 0,
  maxValue = 100,
  color: $color,
  size,
  layout = 'horizontal',
  reverse,
  borderRadius: $$borderRadius,
}: MeterProps): JSX.Element {

  const { palette, componentParameters } = useThemeContext()

  const color = tryResolvePaletteColor($color, palette)

  const [layoutBasedClassName, maskAngle] = layoutPresets[layout] ?? layoutPresets.horizontal

  const p = percent(100 * getPercentage(value, minValue, maxValue))

  const effectiveSize = isNumber(size) ? size : (sizePresets[size] ?? sizePresets.m)

  const $borderRadius = $$borderRadius ?? componentParameters.inputElementBorderRadius
  const containerBorderRadius = isNumber($borderRadius)
    ? $borderRadius
    : effectiveSize * Number($borderRadius.replace('%', '')) / 100
  const fillBorderRadius = `calc(${serializePixelValue(containerBorderRadius)} - ${2 * componentParameters.inputElementBorderSize}px)`

  const containerRef = useRef<View>(null)
  useEffect(() => {
    return injectInlineCSSVariables({
      [KEY_TINT]: color,
      [KEY_CONTAINER_BORDER_RADIUS]: containerBorderRadius,
      [KEY_SIZE]: effectiveSize,
      [KEY_FILL_BORDER_RADIUS]: fillBorderRadius,
      [KEY_DIRECTION_MULTIPLIER]: reverse ? -1 : 1,
    }, containerRef.current)
  }, [color, containerBorderRadius, effectiveSize, fillBorderRadius, reverse])

  return (
    <View
      ref={containerRef}
      className={c(styles.container, layoutBasedClassName)}
      role='meter'
      aria-valuemin={minValue}
      aria-valuemax={maxValue}
    >
      <View
        className={styles.fill}
        style={{ maskImage: `linear-gradient(${maskAngle + (reverse ? 180 : 0)}deg, black ${p}, transparent ${p})` }}
      />
    </View>
  )
}
