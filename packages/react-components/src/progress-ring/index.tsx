import { serializePixelValue } from '@glyph-cat/css-utils'
import { getPercentage } from '@glyph-cat/swiss-army-knife'
import { isNumber } from '@glyph-cat/type-checking'
import clsx from 'clsx'
import { type Property } from 'csstype'
import { forwardRef, type ReactNode } from 'react'
import { View, ViewProps } from '../view'
import styles from './index.module.css'

/**
 * @public
 */
export interface ProgressRingProps extends ViewProps {
  /**
   * The foreground color.
   * @defaultValue `'#808080'`
   */
  colorFg?: Property.Color
  /**
   * The background color.
   * @defaultValue `'#80808040'` when determinate, `'transparent'` when indeterminate.
   */
  colorBg?: Property.Color
  /**
   * The current progress value.
   * Omit this parameter to indicate an indeterminate state.
   * @defaultValue `undefined`
   */
  value?: number
  /**
   * The minimum value.
   * @defaultValue `0`
   */
  minValue?: number
  /**
   * The maximum value.
   * @defaultValue `100`
   */
  maxValue?: number
  /**
   * When expressed as a number, it is equivalent to pixel units (`64` = `64px`).
   * @defaultValue `64`
   */
  size?: Property.Height<number>
  /**
   * Thickness of the ring.
   * @defaultValue `8`
   */
  thickness?: number
}

export interface ProgressRing extends View {
  (props: ProgressRingProps): ReactNode
}

/**
 * A circular progress indicator.
 * @public
 */
export const ProgressRing = forwardRef<View, ProgressRingProps>(function ProgressRingBase({
  value,
  minValue = 0,
  maxValue = 100,
  colorFg = '#808080',
  colorBg,
  size = 64,
  thickness = 8,
  className,
  children,
  style,
  ...props
}, ref): ReactNode {
  const isDeterminate = isNumber(value) && isNumber(minValue) && isNumber(maxValue)
  const angle = isDeterminate ? (360 * getPercentage(value, minValue, maxValue)) : 0
  colorBg = colorBg ?? (isDeterminate ? '#80808040' : 'transparent')
  const progressRing = (
    <View.Relative
      ref={ref}
      className={clsx(styles.progressRing, className)}
      role='progressbar'
      aria-valuemin={minValue}
      aria-valuemax={maxValue}
      aria-busy={!isDeterminate}
      {...isDeterminate ? { 'aria-valuenow': value } : {}}
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
      {isDeterminate && <View.Absolute role='presentation' />}
    </View.Relative>
  )
  return children ? (
    <View.Relative className={styles.container}>
      {progressRing}
      <View.Absolute>{children}</View.Absolute>
    </View.Relative>
  ) : progressRing
})
