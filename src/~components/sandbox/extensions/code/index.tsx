import { c } from '@glyph-cat/swiss-army-knife'
import { JSX } from 'react'
import styles from './index.module.css'

export type CodeProps = JSX.IntrinsicElements['code']

export function Code({
  className,
  children,
  ...props
}: CodeProps): JSX.Element {
  return (
    <code
      className={c(className, styles.code)}
      {...props}
    >
      {children}
    </code>
  )
}
