import { serializePixelValue } from '@glyph-cat/css-utils'
import { getPercentage } from '@glyph-cat/swiss-army-knife'
import { isNumber } from '@glyph-cat/type-checking'
import clsx from 'clsx'
import { type Property } from 'csstype'
import { type ReactNode } from 'react'
import { View, ViewProps } from '../view'
import styles from './index.module.css'

// Refs:
// https://www.npmjs.com/package/rollup-plugin-postcss
// https://www.npmjs.com/package/rollup-plugin-styles
// https://www.npmjs.com/package/rollup-plugin-import-css

export interface ProgressRingProps extends ViewProps {
  /**
   * @defaultValue `'#808080'`
   */
  colorFg?: Property.Color
  /**
   * @defaultValue `'#80808040'` when determinate, `'transparent'` when indeterminate.
   */
  colorBg?: Property.Color
  /**
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
   * @defaultValue `64`
   */
  size?: number
  /**
   * @defaultValue `8`
   */
  thickness?: number
  /**
   * @defaultValue `'round'`
   */
  variant?: 'round' | 'flat'
}

export function ProgressRing({
  value,
  minValue = 0,
  maxValue = 100,
  colorFg = '#808080',
  colorBg,
  size = 64,
  thickness = 8,
  variant = 'round',
  className,
  children,
  style,
  ...props
}: ProgressRingProps): ReactNode {
  const isDeterminate = isNumber(value) && isNumber(minValue) && isNumber(maxValue)
  const angle = isDeterminate ? (360 * getPercentage(value, minValue, maxValue)) : 0
  colorBg = colorBg ?? (isDeterminate ? '#80808040' : 'transparent')
  const progressRing = (
    <View
      className={clsx(styles.progressRing, className)}
      role='progressbar'
      aria-valuemin={minValue}
      aria-valuemax={maxValue}
      aria-busy={!isDeterminate}
      {...isDeterminate ? { 'aria-valuenow': value } : {}}
      data-variant={variant}
      data-overshoot={isDeterminate && value > maxValue}
      style={{
        '--angle': `${angle}deg`,
        '--colorFg': colorFg,
        '--colorBg': colorBg,
        '--size': serializePixelValue(size),
        '--thickness': serializePixelValue(thickness),
        ...style,
      }}
      {...props}
    >
      {(variant === 'round' && isDeterminate) && <View role='presentation' />}
    </View>
  )
  return children ? (
    <View className={styles.container}>
      {progressRing}
      <View>{children}</View>
    </View>
  ) : progressRing
}
