import clsx from 'clsx'
import { ComponentProps, ReactNode } from 'react'
import styles from './index.module.css'

/**
 * @public
 */
export type ViewProps = ComponentProps<'div'>

/**
 * A drop-in replacement for the `<div>` element with style `display: grid;`
 * @public
 */
export function View({
  children,
  className,
  ...props
}: ViewProps): ReactNode {
  return (
    <div // eslint-disable-line react/forbid-elements
      className={clsx(styles.view, className)}
      {...props}
    >
      {children}
    </div>
  )
}
