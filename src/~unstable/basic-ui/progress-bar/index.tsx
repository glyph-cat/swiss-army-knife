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
import { BasicUIColor, BasicUILayout, BasicUISize } from '../abstractions'
import { tryResolvePaletteColor } from '../internals/try-resolve-palette-color'
import styles from './index.module.css'

const sizePresets: Record<BasicUISize, number> = {
  's': 12,
  'm': 20,
  'l': 32,
} as const

const layoutPresets: Record<BasicUILayout, string> = {
  'horizontal': styles.layoutH,
  'vertical': styles.layoutV,
} as const

const degreePresets: Record<BasicUILayout, number> = {
  'horizontal': 90,
  'vertical': 0,
} as const

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
  layout = 'horizontal',
  reverse,
  borderRadius: $$borderRadius,
}: ProgressBarProps): JSX.Element => {

  const { palette, componentParameters } = useThemeContext()

  const color = tryResolvePaletteColor($color, palette)

  const indeterminate = !isNumber(value)
  const p = indeterminate ? percent(100) : percent(100 * getPercentage(value, minValue, maxValue))

  const effectiveSize = isNumber(size) ? size : (sizePresets[size] ?? sizePresets.m)

  const $borderRadius = $$borderRadius ?? componentParameters.inputElementBorderRadius
  const containerBorderRadius = isNumber($borderRadius)
    ? $borderRadius
    : effectiveSize * Number($borderRadius.replace('%', '')) / 100
  const fillBorderRadius = `calc(${serializePixelValue(containerBorderRadius)} - ${2 * componentParameters.inputElementBorderSize}px)`

  const containerRef = useRef<View>(null)
  useEffect(() => {
    return injectInlineCSSVariables({
      tint: color,
      containerBorderRadius: containerBorderRadius,
      size: effectiveSize,
      fillBorderRadius,
    }, containerRef.current)
  }, [color, containerBorderRadius, effectiveSize, fillBorderRadius])

  // TODO: Add `1` or `-1` direction multiplier on `background-position-...`

  return (
    <View
      ref={containerRef}
      className={c(
        styles.container,
        layoutPresets[layout] ?? layoutPresets.horizontal,
      )}
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
        style={{
          maskImage: `linear-gradient(${(degreePresets[layout] ?? degreePresets.horizontal) + (reverse ? 180 : 0)}deg, black ${p}, transparent ${p})`,
        }}
      />
    </View>
  )
}

__assignDisplayName(ProgressBar)
