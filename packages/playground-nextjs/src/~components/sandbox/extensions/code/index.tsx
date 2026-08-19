import clsx from 'clsx'
import { JSX, ReactNode } from 'react'
import styles from './index.module.css'

export type CodeProps = JSX.IntrinsicElements['code']

export function Code({
  className,
  children,
  ...props
}: CodeProps): ReactNode {
  return (
    <code
      className={clsx(className, styles.code)}
      {...props}
    >
      {children}
    </code>
  )
}
