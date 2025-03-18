import {
  getPercentage,
  injectInlineCSSVariables,
  isNumber,
  LenientString,
  percent,
} from '@glyph-cat/swiss-army-knife'
import { useThemeContext, View } from '@glyph-cat/swiss-army-knife-react'
import { JSX, useEffect, useRef } from 'react'
import { BasicUIColor, BasicUISize } from '../abstractions'
import { tryResolvePaletteColor } from '../internals/try-resolve-palette-color'
import styles from './index.module.css'

const sizePresets: Record<BasicUISize, number> = {
  's': 12,
  'm': 16,
  'l': 24,
}

/**
 * @public
 */
export interface ProgressBarProps {
  /**
   * The current progress value.
   * This must be a value equal to or between `minValue` and `maxValue`.
   * Omit this parameter to indicate an indeterminate state.
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
   * @defaultValue `'50%'`
   */
  borderRadius?: number | string
}

/**
 * @public
 */
export interface ProgressBar extends HTMLProgressElement {
  (props: ProgressBarProps): JSX.Element
}

export const ProgressBar = ({
  value,
  minValue = 0,
  maxValue = 100,
  color: $color,
  size,
  borderRadius: $$borderRadius,
}: ProgressBarProps): JSX.Element => {

  const { palette, componentParameters } = useThemeContext()

  const color = tryResolvePaletteColor($color, palette)

  const indeterminate = !isNumber(value)

  // TODO: what about rtl and vertical layouts
  const effectiveSize = isNumber(size) ? size : (sizePresets[size] ?? sizePresets.m)

  const $borderRadius = $$borderRadius ?? componentParameters.inputElementBorderRadius
  const containerBorderRadius = isNumber($borderRadius)
    ? $borderRadius
    : effectiveSize * Number($borderRadius.replace('%', '')) / 100
  const fillBorderRadius = isNumber($borderRadius)
    ? `calc(${containerBorderRadius}px - ${2 * componentParameters.inputElementBorderRadius}px)`
    : `${containerBorderRadius}px`

  const containerRef = useRef<View>(null)
  useEffect(() => {
    return injectInlineCSSVariables({
      tint: color,
      containerBorderRadius: containerBorderRadius,
      size: effectiveSize,
      fillBorderRadius: `${fillBorderRadius} 0 0 ${fillBorderRadius}`,
    }, containerRef.current)
  }, [color, containerBorderRadius, effectiveSize, fillBorderRadius])

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
      <View
        className={styles.fill}
        style={{ width: percent(100 * getPercentage(value, minValue, maxValue)) }}
      />
    </View>
  )
}

