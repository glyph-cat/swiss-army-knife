import { DetailedHTMLProps, HTMLAttributes, forwardRef, useImperativeHandle } from 'react'
import { c } from '../../../styling'
import { useRef } from '../../hooks'
import styles from './index.module.css'

/**
 * @public
 */
export type ViewProps = DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>

/**
 * @public
 */
export type View = { (props: ViewProps): JSX.Element } & HTMLDivElement

/**
 * @public
 */
export const View = forwardRef(({
  children,
  className,
  ...otherProps
}: ViewProps, ref): JSX.Element => {
  const divRef = useRef<HTMLDivElement>(null)
  useImperativeHandle(ref, () => divRef.current)
  return (
    <div // eslint-disable-line react/forbid-elements
      ref={divRef}
      className={c(styles.view, className)}
      {...otherProps}
    >
      {children}
    </div>
  )
})
