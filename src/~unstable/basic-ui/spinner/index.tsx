import { JSX } from 'react'
import { BasicUIColor, BasicUISize } from '../abstractions'
import styles from './index.module.css'

/**
 * @public
 */
export type SpinnerProps = Omit<JSX.IntrinsicElements['progress'], 'color' | 'value'> & {
  /**
   * Any value from `0.0` to `1.0`.
   * You can use {@link getPercentage} to calculate the value.
   * @defaultValue `0.0`
   */
  value?: number
  /**
   * @defaultValue `false`
   */
  indeterminate?: boolean
  /**
   * @defaultValue `'primary'`
   */
  color?: BasicUIColor
  /**
   * @defaultValue `'m'`
   */
  size?: BasicUISize | number
  thickness?: number // TODO: default value
}

/**
 * @public
 */
export interface Spinner extends HTMLProgressElement {
  (props: SpinnerProps): JSX.Element
}

export function Spinner({
  value = 0,
  indeterminate,
  color: $color,
  size,
  thickness,
}: SpinnerProps): JSX.Element {
  // Do not use ARIA properties, use hidden <progress> element and forward ref to it
  return (
    <>
      <progress
        className={styles.progress}
      // ...
      />
    </>
  )
}
