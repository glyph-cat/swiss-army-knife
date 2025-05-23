import {
  c,
  clamp,
  getPercentage,
  injectInlineCSSVariables,
  isNumber,
  LenientString,
  percent,
  serializePixelValue,
} from '@glyph-cat/swiss-army-knife'
import { JSX, useEffect, useRef } from 'react'
import { __setDisplayName } from '../../../_internals'
import { useThemeContext } from '../../../styling'
import { View } from '../../core'
import { tryResolvePaletteColor } from '../_internals/try-resolve-palette-color'
import { BasicUIColor, BasicUILayout, BasicUISize } from '../abstractions'
import {
  __CONTAINER_BORDER_RADIUS,
  __DIRECTION_MULTIPLIER,
  __FILL_BORDER_RADIUS,
  __SIZE,
  __TINT,
} from '../constants'
import { styles } from './styles'

const sizePresets: Readonly<Record<BasicUISize, number>> = {
  's': 12,
  'm': 20,
  'l': 32,
}

const layoutPresets: Readonly<Record<BasicUILayout, [className: string, maskAngle: number]>> = {
  'horizontal': [styles.layoutH, 90],
  'vertical': [styles.layoutV, 0],
}

/**
 * @public
 */
export interface ProgressBarProps {
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
  /**
   * @defaultValue `'progressbar'`
   */
  role?: 'progressbar' | 'meter'
}

/**
 * @public
 */
export const ProgressBar = ({
  value,
  minValue = 0,
  maxValue = 100,
  color: $color,
  size,
  layout = 'horizontal',
  reverse,
  borderRadius: $$borderRadius,
  role,
}: ProgressBarProps): JSX.Element => {

  const { palette, componentParameters } = useThemeContext()

  const color = tryResolvePaletteColor($color, palette)

  const [layoutBasedClassName, maskAngle] = layoutPresets[layout] ?? layoutPresets.horizontal

  const indeterminate = !isNumber(value)
  const p = percent(indeterminate
    ? 100
    : 100 * getPercentage(clamp(value, minValue, maxValue), minValue, maxValue)
  )

  const effectiveSize = isNumber(size) ? size : (sizePresets[size] ?? sizePresets.m)

  const $borderRadius = $$borderRadius ?? componentParameters.inputElementBorderRadius
  const containerBorderRadius = isNumber($borderRadius)
    ? $borderRadius
    : effectiveSize * Number($borderRadius.replace('%', '')) / 100
  const fillBorderRadius = `calc(${serializePixelValue(containerBorderRadius)} - ${2 * componentParameters.inputElementBorderSize}px)`

  const containerRef = useRef<View>(null)
  useEffect(() => {
    return injectInlineCSSVariables({
      [__TINT]: color,
      [__CONTAINER_BORDER_RADIUS]: containerBorderRadius,
      [__SIZE]: effectiveSize,
      [__FILL_BORDER_RADIUS]: fillBorderRadius,
      [__DIRECTION_MULTIPLIER]: reverse ? -1 : 1,
    }, containerRef.current)
  }, [color, containerBorderRadius, effectiveSize, fillBorderRadius, reverse])

  return (
    <View
      ref={containerRef}
      className={c(styles.container, layoutBasedClassName)}
      role={role}
      aria-valuemin={minValue}
      aria-valuemax={maxValue}
      {...indeterminate ? {
        'aria-busy': true,
      } : {
        'aria-valuenow': value,
      }}
    >
      <View
        className={styles.fill}
        style={{ maskImage: `linear-gradient(${maskAngle + (reverse ? 180 : 0)}deg, black ${p}, transparent ${p})` }}
      />
    </View>
  )
}

__setDisplayName(ProgressBar)
