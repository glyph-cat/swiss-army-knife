import clsx from 'clsx'
import {
  forwardRef,
  type ComponentProps,
  type ComponentRef,
  type ForwardRefExoticComponent,
  type ReactNode,
  type RefAttributes,
} from 'react'
import styles from './index.module.css'

/**
 * @public
 */
export type ViewProps = ComponentProps<'div'>

/**
 * @public
 */
export type ViewNamespace = ForwardRefExoticComponent<ViewProps & RefAttributes<HTMLDivElement>> & {
  (props: ViewProps): ReactNode
  /**
   * A drop-in replacement for the `<div>` element with the following styles:
   * ```css
   * .view {
   *   display: grid;
   * }
   * .viewRelative {
   *   position: relative;
   * }
   * @public
   */
  Relative: ForwardRefExoticComponent<ViewProps & RefAttributes<HTMLDivElement>>
  /**
   * A drop-in replacement for the `<div>` element with the following styles:
   * ```css
   * .view {
   *   display: grid;
   * }
   * .viewAbsolute {
   *   position: absolute;
   * }
   * @public
   */
  Absolute: ForwardRefExoticComponent<ViewProps & RefAttributes<HTMLDivElement>>
  /**
   * A drop-in replacement for the `<div>` element with the following styles:
   * ```css
   * .view {
   *   display: grid;
   * }
   * .viewFixed {
   *   position: fixed;
   * }
   * @public
   */
  Fixed: ForwardRefExoticComponent<ViewProps & RefAttributes<HTMLDivElement>>
}

/**
 * @public
 */
export type View = ComponentRef<ViewNamespace>

const DefaultView = forwardRef<View, ViewProps>(function DefaultViewBase({
  children,
  className,
  ...props
}, ref): ReactNode {
  return (
    <div // eslint-disable-line react/forbid-elements
      ref={ref}
      className={clsx(styles.view, className)}
      {...props}
    >
      {children}
    </div>
  )
})

const RelativeView = forwardRef<View, ViewProps>(function RelativeViewBase({
  children,
  className,
  ...props
}, ref): ReactNode {
  return (
    <div // eslint-disable-line react/forbid-elements
      ref={ref}
      className={clsx(styles.view, styles.viewRelative, className)}
      {...props}
    >
      {children}
    </div>
  )
})

const AbsoluteView = forwardRef<View, ViewProps>(function AbsoluteViewBase({
  children,
  className,
  ...props
}, ref): ReactNode {
  return (
    <div // eslint-disable-line react/forbid-elements
      ref={ref}
      className={clsx(styles.view, styles.viewAbsolute, className)}
      {...props}
    >
      {children}
    </div>
  )
})

const FixedView = forwardRef<View, ViewProps>(function AbsoluteViewBase({
  children,
  className,
  ...props
}, ref): ReactNode {
  return (
    <div // eslint-disable-line react/forbid-elements
      ref={ref}
      className={clsx(styles.view, styles.viewFixed, className)}
      {...props}
    >
      {children}
    </div>
  )
})

/**
 * A drop-in replacement for the `<div>` element with the following styles:
 * ```css
 * .view {
 *   display: grid;
 * }
 * ```
 * @public
 */
export const View = Object.assign(DefaultView, {
  Relative: RelativeView,
  Absolute: AbsoluteView,
  Fixed: FixedView,
}) as ViewNamespace
