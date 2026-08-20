import clsx from 'clsx'
import { ComponentProps, ReactNode } from 'react'
import styles from './index.module.css'

export type ViewProps = ComponentProps<'div'>

export function View({
  children,
  className,
  ...props
}: ViewProps): ReactNode {
  return (
    <div className={clsx(styles.view, className)} {...props}>
      {children}
    </div>
  )
}
